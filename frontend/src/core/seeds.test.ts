import { beforeEach, describe, expect, it, vi } from 'vitest'

import { collectUpstream, controlledNumberWidgets, randomValue, rerollSeeds, type SeedNode } from './seeds'

type Graph = NonNullable<SeedNode['graph']> & { nodes: Map<SeedNode['id'], SeedNode>; links: Map<number, { origin_id: SeedNode['id'] }> }

function makeGraph(): Graph {
  const nodes = new Map<SeedNode['id'], SeedNode>()
  const links = new Map<number, { origin_id: SeedNode['id'] }>()
  return { nodes, links, getLink: (id) => links.get(id as number), getNodeById: (id) => nodes.get(id) ?? null }
}

let root: Graph
let nextLink: number
beforeEach(() => {
  root = makeGraph()
  nextLink = 1
})

function link(origin: SeedNode | null, graph: Graph = root): { link: number | null } {
  if (!origin) return { link: null }
  graph.links.set(nextLink, { origin_id: origin.id })
  return { link: nextLink++ }
}

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

function node(id: number, widgets: unknown[] = [], inputs: (SeedNode | null)[] = [], graph: Graph = root): SeedNode {
  const n: SeedNode = { id, widgets: widgets as SeedNode['widgets'], inputs: inputs.map((o) => link(o, graph)), graph }
  graph.nodes.set(id, n)
  return n
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
    a.inputs = [link(b)]
    expect(collectUpstream(node(3, [], [b])).map((n) => n.id).sort()).toEqual([1, 2])
  })

  it('includes the nodes inside upstream subgraphs, nested ones too', () => {
    const nested = makeGraph()
    const deep = node(30, [], [], nested)
    const inner = makeGraph()
    const sampler = node(20, [], [], inner)
    const nestedNode = { ...node(21, [], [], inner), subgraph: { nodes: [deep] } }
    inner.nodes.set(21, nestedNode)
    const prompt = node(1)
    // The host's SubgraphNode.getInputNode throws "reading 'getLinks'" for most slots
    // (frontend 1.53.6), so it must not be used.
    const sub = {
      ...node(2, [], [prompt, null]),
      subgraph: { nodes: [sampler, nestedNode] },
      getInputNode: () => {
        throw new TypeError("Cannot read properties of undefined (reading 'getLinks')")
      }
    }
    root.nodes.set(2, sub)
    expect(collectUpstream(node(3, [], [sub])).map((n) => n.id).sort()).toEqual([1, 2, 20, 21, 30])
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
