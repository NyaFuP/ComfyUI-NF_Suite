/**
 * Partial runs through the standard ComfyUI queue (shared by Independent Queue and,
 * later, Image Selector).
 *
 * queuePartial(): graphToPrompt -> rewrite -> POST /prompt with partial_execution_targets,
 * then follows that prompt_id's websocket events into a reactive JobState.
 * Only output nodes can be targets (execution.py validate_prompt), so callers swap
 * their node to an output-node variant with swapClassType().
 */
import { reactive } from 'vue'

import { deleteQueuedJob, graphToPrompt, interruptJob, onApiEvent, queuePrompt } from './comfy'
import { type ApiPrompt, collectAncestors } from './prompt'

export { type ApiPrompt, type ApiPromptNode, collectAncestors, swapClassType } from './prompt'

export type JobStatus = 'queued' | 'running' | 'success' | 'error' | 'interrupted' | 'cancelled'

export interface JobState {
  promptId: string
  status: JobStatus
  runningNode: string | null
  progress: { value: number; max: number } | null
  nodesDone: number
  nodesTotal: number
  outputs: Record<string, unknown>
  error: { message: string; nodeId?: string; nodeType?: string } | null
  /** internal: ids of the target and its ancestors (the only nodes this job runs) */
  branch: string[]
  /** internal: finished/cached node ids within `branch` */
  done: string[]
}

const FINISHED: JobStatus[] = ['success', 'error', 'interrupted', 'cancelled']
export const JOB_EVENTS = [
  'execution_start',
  'execution_cached',
  'progress_state',
  'executed',
  'execution_success',
  'execution_error',
  'execution_interrupted'
] as const

// --- pure helpers ----------------------------------------------------------------

export function initialJobState(promptId: string, branch: string[]): JobState {
  return {
    promptId,
    status: 'queued',
    runningNode: null,
    progress: null,
    nodesDone: 0,
    nodesTotal: branch.length,
    outputs: {},
    error: null,
    branch: [...branch],
    done: []
  }
}

interface NodeProgress {
  state?: string
  value?: number
  max?: number
}

function withDone(state: JobState, ids: string[]): JobState {
  // execution_cached lists every cached node of the prompt, not only this branch.
  const done = [...new Set([...state.done, ...ids.filter((id) => state.branch.includes(id))])]
  return { ...state, done, nodesDone: done.length }
}

/** Fold one websocket event into the job state. Events of other prompts are ignored. */
export function reduceJob(state: JobState, event: { type: string; data: Record<string, unknown> }): JobState {
  const data = event.data ?? {}
  if (data.prompt_id !== state.promptId || FINISHED.includes(state.status)) return state

  switch (event.type) {
    case 'execution_start':
      return { ...state, status: 'running' }
    case 'execution_cached':
      return withDone({ ...state, status: 'running' }, ((data.nodes as unknown[]) ?? []).map(String))
    case 'progress_state': {
      const nodes = Object.entries((data.nodes as Record<string, NodeProgress>) ?? {})
      const finished = nodes.filter(([, n]) => n.state === 'finished').map(([id]) => id)
      const running = nodes.find(([, n]) => n.state === 'running')
      return withDone(
        {
          ...state,
          status: 'running',
          runningNode: running ? running[0] : null,
          progress: running ? { value: running[1].value ?? 0, max: running[1].max ?? 1 } : null
        },
        finished
      )
    }
    case 'executed':
      return { ...state, outputs: { ...state.outputs, [String(data.node)]: data.output } }
    case 'execution_success':
      return { ...state, status: 'success', runningNode: null, progress: null }
    case 'execution_error':
      return {
        ...state,
        status: 'error',
        runningNode: null,
        progress: null,
        error: {
          message: String(data.exception_message ?? 'Execution failed'),
          nodeId: data.node_id === undefined ? undefined : String(data.node_id),
          nodeType: data.node_type === undefined ? undefined : String(data.node_type)
        }
      }
    case 'execution_interrupted':
      return { ...state, status: 'interrupted', runningNode: null, progress: null }
    default:
      return state
  }
}

// --- queueing ----------------------------------------------------------------------

export interface Job {
  readonly state: JobState
  /** Interrupt when running, remove from the queue when still pending. */
  cancel(): Promise<void>
  /** Stop listening to events (called automatically when the job finishes). */
  dispose(): void
}

export class QueueError extends Error {
  constructor(
    message: string,
    readonly nodeErrors?: Record<string, unknown>
  ) {
    super(message)
  }
}

function describeQueueError(e: unknown): QueueError {
  const response = (e as { response?: { error?: unknown; node_errors?: Record<string, unknown> } })?.response
  if (response) {
    const error = response.error as { message?: string; details?: string } | string | undefined
    // ComfyUI repeats a validate_inputs error once per input ("<input> - <message>"); keep one copy.
    const nodeMessages = [
      ...new Set(
        Object.values(response.node_errors ?? {})
          .flatMap((n) => (n as { errors?: { message?: string; details?: string }[] }).errors ?? [])
          .map((err) => [err.message, err.details?.replace(/^[\w.]+ - /, '')].filter(Boolean).join(': '))
      )
    ]
    const base = typeof error === 'string' ? error : [error?.message, error?.details].filter(Boolean).join(': ')
    return new QueueError([base, ...nodeMessages].filter(Boolean).join('\n') || 'Queue failed', response.node_errors)
  }
  return new QueueError(e instanceof Error ? e.message : String(e))
}

/**
 * Queue the current graph with only `targetIds` as outputs.
 * `rewrite` gets the API prompt (e.g. to swap the target to its output variant);
 * `targetIds` may be computed from the rewritten prompt.
 */
export async function queuePartial(options: {
  targetIds: string[] | ((prompt: ApiPrompt) => string[])
  rewrite?: (prompt: ApiPrompt) => ApiPrompt
}): Promise<Job> {
  const data = await graphToPrompt()
  const prompt = options.rewrite ? options.rewrite(data.output as ApiPrompt) : (data.output as ApiPrompt)
  const targets = typeof options.targetIds === 'function' ? options.targetIds(prompt) : options.targetIds
  if (!targets.length) throw new QueueError('Nothing to run: no output node to target.')
  const branch = [...new Set(targets.flatMap((id) => [id, ...collectAncestors(prompt, id)]))]

  // Subscribe before queueing so no event can be missed; events are buffered until the id is known.
  const buffered: { type: string; data: Record<string, unknown> }[] = []
  let state: JobState | null = null
  const unsubscribers = JOB_EVENTS.map((type) =>
    onApiEvent(type, (detail) => {
      const event = { type, data: (detail ?? {}) as Record<string, unknown> }
      if (state) apply(event)
      else buffered.push(event)
    })
  )
  const dispose = () => unsubscribers.splice(0).forEach((off) => off())

  let promptId: string
  try {
    promptId = (await queuePrompt({ output: prompt, workflow: data.workflow }, targets)).prompt_id
  } catch (e) {
    dispose()
    throw describeQueueError(e)
  }

  const reactiveState = reactive(initialJobState(promptId, branch)) as JobState
  state = reactiveState
  function apply(event: { type: string; data: Record<string, unknown> }) {
    Object.assign(reactiveState, reduceJob(reactiveState, event))
    if (FINISHED.includes(reactiveState.status)) dispose()
  }
  buffered.splice(0).forEach(apply)

  return {
    state: reactiveState,
    dispose,
    async cancel() {
      if (reactiveState.status === 'running') {
        await interruptJob(promptId)
      } else if (reactiveState.status === 'queued') {
        await deleteQueuedJob(promptId)
        Object.assign(reactiveState, { status: 'cancelled' as JobStatus })
        dispose()
      }
    }
  }
}
