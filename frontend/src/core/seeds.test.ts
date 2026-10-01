import { describe, expect, it, vi } from 'vitest'

import { collectUpstream, controlledNumberWidgets, randomValue, rerollSeeds, type SeedNode } from './seeds'

function control(value = 'fixed') {
  return {
    name: 'control_after_generate',
    value,
    options: { values: ['fixed', 'increment', 'decrement', 'randomize'] },
    beforeQueued: vi.fn(),
    afterQueued: vi.fn()
  }
}

function seedWidget(value = 5, opts: Record<string, number> = { min: 0, max: 100, step2: 1 }, ctrl = control()) {
  return { name: 'seed', type: 'number', value, options: opts, linkedWidgets: [ctrl], callback: vi.fn() }
}

function node(id: number, widgets: unknown[] = [], inputs: (SeedNode | null)[] = []): SeedNode {
  return {
    id,
    widgets: widgets as SeedNode['widgets'],
    inputs: inputs.map(() => ({})),
    getInputNode: (slot: number) => inputs[slot] ?? null
  }
}

describe('collectUpstream', () => {
  it('collects all upstream nodes once, excluding the start node', () => {
    const a = node(1)
    const b = node(2, [], [a])
    const c = node(3, [], [a, b])
    const start = node(4, [], [c, null])
    expect(collectUpstream(start).map((n) => n.id).sort()).toEqual([1, 2, 3])
  })

  it('survives cycles', () => {
    const a = node(1)
    const b = node(2, [], [a])
    ;(a as { getInputNode: (slot: number) => SeedNode | null }).getInputNode = () => b
    a.inputs = [{}]
    expect(collectUpstream(node(3, [], [b])).map((n) => n.id).sort()).toEqual([1, 2])
  })
})

describe('controlledNumberWidgets', () => {
  it('finds number widgets that have a linked control widget, whatever its name', () => {
    const renamed = { ...control(), name: 'fixed' } // host names it after the default when given as a string
    const n = node(1, [
      seedWidget(1, undefined, renamed),
      { name: 'steps', type: 'number', value: 20, options: {} },
      { name: 'sampler', type: 'combo', value: 'euler', options: {}, linkedWidgets: [control()] }
    ])
    expect(controlledNumberWidgets(n).map(({ widget }) => widget.name)).toEqual(['seed'])
  })
})

describe('randomValue', () => {
  it('stays within min/max on the step grid', () => {
    for (const r of [0, 0.5, 0.999999]) {
      const v = randomValue({ min: 10, max: 20, step2: 2 }, () => r)
      expect(v).toBeGreaterThanOrEqual(10)
      expect(v).toBeLessThanOrEqual(20)
      expect((v - 10) % 2).toBe(0)
    }
  })

  it('limits huge ranges to what JavaScript can represent like the host does', () => {
    const v = randomValue({ min: 0, max: 0xffffffffffffffff, step2: 1 }, () => 0.999999999)
    expect(v).toBeLessThanOrEqual(1125899906842624)
  })
})

describe('rerollSeeds', () => {
  it('randomize: sets a new random value on every controlled number upstream', () => {
    const w = seedWidget(5)
    const up = node(1, [w])
    const changed = rerollSeeds(node(2, [], [up]), 'randomize', () => 0.5)
    expect(w.value).toBe(50)
    expect(w.callback).toHaveBeenCalledWith(50)
    expect(changed).toEqual([{ nodeId: 1, widget: 'seed', from: 5, to: 50 }])
  })

  it('randomize ignores the control setting (fixed seeds are re-rolled too)', () => {
    const w = seedWidget(5, undefined, control('fixed'))
    rerollSeeds(node(2, [], [node(1, [w])]), 'randomize', () => 0.1)
    expect(w.value).toBe(10)
  })

  it('follow: delegates to the host control hooks as a full (non-partial) run', () => {
    const ctrl = control('increment')
    rerollSeeds(node(2, [], [node(1, [seedWidget(5, undefined, ctrl)])]), 'follow')
    expect(ctrl.beforeQueued).toHaveBeenCalledWith({ isPartialExecution: false })
    expect(ctrl.afterQueued).toHaveBeenCalledWith({ isPartialExecution: false })
  })

  it('off: changes nothing', () => {
    const w = seedWidget(5)
    expect(rerollSeeds(node(2, [], [node(1, [w])]), 'off')).toEqual([])
    expect(w.value).toBe(5)
  })

  it('does not touch the start node itself', () => {
    const own = seedWidget(5)
    rerollSeeds(node(2, [own]), 'randomize', () => 0.5)
    expect(own.value).toBe(5)
  })
})
