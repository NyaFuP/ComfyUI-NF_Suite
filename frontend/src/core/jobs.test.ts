import { beforeEach, describe, expect, it, vi } from 'vitest'

import { type ApiPrompt, collectAncestors, initialJobState, queuePartial, reduceJob, swapClassType } from './jobs'

const comfy = vi.hoisted(() => {
  const listeners = new Map<string, Set<(detail: unknown) => void>>()
  return {
    listeners,
    emit(type: string, detail: unknown) {
      listeners.get(type)?.forEach((fn) => fn(detail))
    },
    graphToPrompt: vi.fn(),
    queuePrompt: vi.fn(),
    interruptJob: vi.fn(async () => {}),
    deleteQueuedJob: vi.fn(async () => {}),
    onApiEvent(type: string, fn: (detail: unknown) => void) {
      if (!listeners.has(type)) listeners.set(type, new Set())
      listeners.get(type)!.add(fn)
      return () => listeners.get(type)!.delete(fn)
    }
  }
})
vi.mock('./comfy', () => comfy)

const PROMPT: ApiPrompt = {
  '1': { class_type: 'Loader', inputs: { name: 'x' } },
  '2': { class_type: 'LLM', inputs: { text: 'hi', config: ['1', 0], seed: 5 } },
  '3': { class_type: 'NF_IndependentQueue', inputs: { value: ['2', 0], seed_mode: 'randomize' } },
  '4': { class_type: 'SaveImage', inputs: { images: ['9', 0] } },
  '9': { class_type: 'Other', inputs: {} }
}

describe('swapClassType', () => {
  it('returns a copy with the class_type replaced', () => {
    const swapped = swapClassType(PROMPT, '3', 'NF_IndependentQueueRun')
    expect(swapped['3'].class_type).toBe('NF_IndependentQueueRun')
    expect(swapped['3'].inputs).toEqual(PROMPT['3'].inputs)
    expect(PROMPT['3'].class_type).toBe('NF_IndependentQueue')
  })

  it('throws when the node is not in the prompt', () => {
    expect(() => swapClassType(PROMPT, '99', 'X')).toThrow(/99/)
  })
})

describe('collectAncestors', () => {
  it('follows links transitively', () => {
    expect([...collectAncestors(PROMPT, '3')].sort()).toEqual(['1', '2'])
  })

  it('does not include unrelated nodes', () => {
    expect(collectAncestors(PROMPT, '4')).toEqual(new Set(['9']))
  })

  it('handles cycles and missing nodes', () => {
    const p: ApiPrompt = {
      a: { class_type: 'A', inputs: { x: ['b', 0], y: ['missing', 0] } },
      b: { class_type: 'B', inputs: { x: ['a', 0] } }
    }
    expect([...collectAncestors(p, 'a')].sort()).toEqual(['a', 'b', 'missing'])
  })
})

describe('reduceJob', () => {
  const start = () => initialJobState('p1', ['1', '2', '3'])
  const ev = (type: string, data: Record<string, unknown>) => ({ type, data: { prompt_id: 'p1', ...data } })

  it('starts queued', () => {
    expect(start()).toMatchObject({ status: 'queued', promptId: 'p1', nodesDone: 0, nodesTotal: 3 })
  })

  it('only counts nodes of the target branch (the server reports every cached node of the prompt)', () => {
    const s = reduceJob(start(), ev('execution_cached', { nodes: ['1', '2', '3', '4', '9'] }))
    expect(s).toMatchObject({ nodesDone: 3, nodesTotal: 3 })
  })

  it('ignores events of other prompts', () => {
    const s = reduceJob(start(), { type: 'execution_start', data: { prompt_id: 'other' } })
    expect(s.status).toBe('queued')
  })

  it('execution_start -> running', () => {
    expect(reduceJob(start(), ev('execution_start', {})).status).toBe('running')
  })

  it('counts cached and finished nodes, tracks the running node and its progress', () => {
    let s = reduceJob(start(), ev('execution_start', {}))
    s = reduceJob(s, ev('execution_cached', { nodes: ['1'] }))
    s = reduceJob(s, ev('progress_state', {
      nodes: {
        '2': { state: 'running', value: 3, max: 10, node_id: '2', prompt_id: 'p1' }
      }
    }))
    expect(s).toMatchObject({ nodesDone: 1, runningNode: '2', progress: { value: 3, max: 10 } })

    s = reduceJob(s, ev('progress_state', {
      nodes: {
        '2': { state: 'finished', value: 10, max: 10, node_id: '2', prompt_id: 'p1' },
        '3': { state: 'running', value: 0, max: 1, node_id: '3', prompt_id: 'p1' }
      }
    }))
    expect(s).toMatchObject({ nodesDone: 2, runningNode: '3', progress: { value: 0, max: 1 } })
  })

  it('stores executed outputs by node id', () => {
    const s = reduceJob(start(), ev('executed', { node: '3', output: { text: ['hello'] } }))
    expect(s.outputs['3']).toEqual({ text: ['hello'] })
  })

  it('success clears the running node', () => {
    let s = reduceJob(start(), ev('progress_state', { nodes: { '3': { state: 'running', value: 0, max: 1 } } }))
    s = reduceJob(s, ev('execution_success', {}))
    expect(s).toMatchObject({ status: 'success', runningNode: null, progress: null })
  })

  it('error keeps the message and node', () => {
    const s = reduceJob(start(), ev('execution_error', {
      node_id: '2', node_type: 'LLM', exception_message: 'connection refused', exception_type: 'X'
    }))
    expect(s).toMatchObject({ status: 'error', error: { message: 'connection refused', nodeId: '2', nodeType: 'LLM' } })
  })

  it('interrupted', () => {
    expect(reduceJob(start(), ev('execution_interrupted', { node_id: '2' })).status).toBe('interrupted')
  })

  it('does not leave a finished state', () => {
    const done = reduceJob(start(), ev('execution_success', {}))
    expect(reduceJob(done, ev('execution_start', {})).status).toBe('success')
  })
})

describe('queuePartial', () => {
  const listenerCount = () => [...comfy.listeners.values()].reduce((n, s) => n + s.size, 0)

  beforeEach(() => {
    comfy.listeners.clear()
    comfy.graphToPrompt.mockReset().mockResolvedValue({ output: PROMPT, workflow: { nodes: [] } })
    comfy.queuePrompt.mockReset()
    comfy.interruptJob.mockClear()
    comfy.deleteQueuedJob.mockClear()
  })

  it('queues the rewritten prompt with the target as the only output', async () => {
    comfy.queuePrompt.mockResolvedValue({ prompt_id: 'p1' })
    const job = await queuePartial({ targetIds: ['3'], rewrite: (p) => swapClassType(p, '3', 'Run') })
    const [data, targets] = comfy.queuePrompt.mock.calls[0]
    expect(targets).toEqual(['3'])
    expect(data.output['3'].class_type).toBe('Run')
    expect(data.workflow).toEqual({ nodes: [] })
    expect(job.state).toMatchObject({ promptId: 'p1', status: 'queued', nodesTotal: 3 })
  })

  it('accepts several targets, or a function of the rewritten prompt', async () => {
    comfy.queuePrompt.mockResolvedValue({ prompt_id: 'p1' })
    const job = await queuePartial({
      targetIds: (prompt) => Object.keys(prompt).filter((id) => prompt[id].class_type === 'SaveImage' || id === '3'),
      rewrite: (p) => p
    })
    expect(comfy.queuePrompt.mock.calls[0][1]).toEqual(['3', '4'])
    // branch = targets + their ancestors: 3 <- 2 <- 1, 4 <- 9
    expect(job.state.nodesTotal).toBe(5)
  })

  it('refuses to queue without targets', async () => {
    await expect(queuePartial({ targetIds: [] })).rejects.toThrow(/nothing to run/i)
    expect(comfy.queuePrompt).not.toHaveBeenCalled()
  })

  it('does not miss events that arrive before the prompt id is known', async () => {
    comfy.queuePrompt.mockImplementation(async () => {
      comfy.emit('execution_start', { prompt_id: 'p1' })
      return { prompt_id: 'p1' }
    })
    const job = await queuePartial({ targetIds: ['3'] })
    expect(job.state.status).toBe('running')
  })

  it('follows events and stops listening when finished', async () => {
    comfy.queuePrompt.mockResolvedValue({ prompt_id: 'p1' })
    const job = await queuePartial({ targetIds: ['3'] })
    comfy.emit('executed', { prompt_id: 'p1', node: '3', output: { text: ['hi'] } })
    comfy.emit('execution_success', { prompt_id: 'p1' })
    expect(job.state.status).toBe('success')
    expect(job.state.outputs['3']).toEqual({ text: ['hi'] })
    expect(listenerCount()).toBe(0)
  })

  it('turns a 400 response into a readable error and unsubscribes', async () => {
    comfy.queuePrompt.mockRejectedValue({
      response: {
        error: { message: 'Prompt outputs failed validation' },
        node_errors: { '2': { errors: [{ message: 'Value not in list', details: 'model: x' }] } }
      }
    })
    await expect(queuePartial({ targetIds: ['3'] })).rejects.toThrow(
      'Prompt outputs failed validation\nValue not in list: model: x'
    )
    expect(listenerCount()).toBe(0)
  })

  it('collapses the per-input copies of one validate_inputs error', async () => {
    const msg = '[NOT_FOUND] Template missing'
    comfy.queuePrompt.mockRejectedValue({
      response: {
        error: { message: 'Prompt outputs failed validation' },
        node_errors: {
          '5': {
            errors: ['template_id', 'variables', 'snapshot'].map((input) => ({
              message: 'Custom validation failed for node',
              details: `${input} - ${msg}`
            }))
          }
        }
      }
    })
    await expect(queuePartial({ targetIds: ['3'] })).rejects.toThrow(
      `Prompt outputs failed validation\nCustom validation failed for node: ${msg}`
    )
  })

  it('cancel removes a pending job from the queue', async () => {
    comfy.queuePrompt.mockResolvedValue({ prompt_id: 'p1' })
    const job = await queuePartial({ targetIds: ['3'] })
    await job.cancel()
    expect(comfy.deleteQueuedJob).toHaveBeenCalledWith('p1')
    expect(comfy.interruptJob).not.toHaveBeenCalled()
    expect(job.state.status).toBe('cancelled')
  })

  it('cancel interrupts a running job', async () => {
    comfy.queuePrompt.mockResolvedValue({ prompt_id: 'p1' })
    const job = await queuePartial({ targetIds: ['3'] })
    comfy.emit('execution_start', { prompt_id: 'p1' })
    await job.cancel()
    expect(comfy.interruptJob).toHaveBeenCalledWith('p1')
    expect(comfy.deleteQueuedJob).not.toHaveBeenCalled()
  })
})
