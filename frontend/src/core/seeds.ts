/**
 * Re-roll upstream seeds before a partial run.
 *
 * Partial runs skip the host's control_after_generate (widgets.ts checks isPartialExecution),
 * so pressing Run again would just hit the cache. These helpers work on node-like objects
 * (only the members listed below) so they stay testable without ComfyUI.
 *
 * Control widgets are found through the value widget's `linkedWidgets`, not by name:
 * the host names the control widget after its default when the input spec gives a string
 * (e.g. "fixed"), see CLAUDE.md.
 */

export type SeedMode = 'randomize' | 'follow' | 'off'

interface ControlWidget {
  name: string
  value: unknown
  options?: { values?: unknown }
  beforeQueued?: (options?: { isPartialExecution?: boolean }) => void
  afterQueued?: (options?: { isPartialExecution?: boolean }) => void
}

interface ValueWidget {
  name: string
  type?: string
  value: unknown
  options?: { min?: number; max?: number; step2?: number }
  linkedWidgets?: unknown[]
  callback?: (value: unknown) => void
}

export interface SeedNode {
  id: number | string
  widgets?: ValueWidget[]
  inputs?: { link?: number | string | null }[]
  graph?: {
    getLink(id: number | string): { origin_id: number | string } | null | undefined
    getNodeById(id: number | string): SeedNode | null | undefined
  } | null
  /** Set on subgraph nodes. */
  subgraph?: { nodes: SeedNode[] }
}

export interface SeedChange {
  nodeId: number | string
  widget: string
  from: unknown
  to: number
}

// The host limits random numbers to this range (widgets.ts applyWidgetControl).
const JS_LIMIT = 1125899906842624

function isControlWidget(widget: unknown): widget is ControlWidget {
  const values = (widget as ControlWidget | null)?.options?.values
  return Array.isArray(values) && values.includes('randomize') && values.includes('fixed')
}

/**
 * All nodes upstream of `start` (each once, `start` excluded), including every node inside
 * upstream subgraphs. Links are resolved through the node's graph like the base
 * LGraphNode.getInputLink: SubgraphNode overrides getInputNode/getInputLink to look inside
 * the subgraph, which throws "reading 'getLinks'" for most input slots (frontend 1.53.6).
 */
export function collectUpstream(start: SeedNode): SeedNode[] {
  const seen = new Set<SeedNode>([start])
  const result: SeedNode[] = []
  const stack = [start]
  const visit = (node: SeedNode | null | undefined) => {
    if (!node || seen.has(node)) return
    seen.add(node)
    result.push(node)
    stack.push(node)
  }
  while (stack.length) {
    const current = stack.pop()!
    for (const input of current.inputs ?? []) {
      if (input.link == null) continue
      const link = current.graph?.getLink(input.link)
      if (link) visit(current.graph?.getNodeById(link.origin_id))
    }
    current.subgraph?.nodes.forEach(visit)
  }
  return result
}

/** Number widgets with a linked control_after_generate widget. */
export function controlledNumberWidgets(node: SeedNode): { widget: ValueWidget; control: ControlWidget }[] {
  const found: { widget: ValueWidget; control: ControlWidget }[] = []
  for (const widget of node.widgets ?? []) {
    if (widget.type !== 'number' || typeof widget.value !== 'number') continue
    const control = widget.linkedWidgets?.find(isControlWidget)
    if (control) found.push({ widget, control })
  }
  return found
}

export function randomValue(
  options: { min?: number; max?: number; step2?: number } = {},
  random: () => number = Math.random
): number {
  const step = options.step2 && options.step2 > 0 ? options.step2 : 1
  const min = Math.max(-JS_LIMIT, options.min ?? 0)
  const max = Math.min(JS_LIMIT, options.max ?? JS_LIMIT)
  const steps = Math.floor((max - min) / step)
  return Math.min(max, Math.floor(random() * (steps + 1)) * step + min)
}

/** Apply `mode` to every controlled number widget upstream of `start`. Returns what changed. */
export function rerollSeeds(start: SeedNode, mode: SeedMode, random: () => number = Math.random): SeedChange[] {
  if (mode === 'off') return []
  const changes: SeedChange[] = []
  for (const node of collectUpstream(start)) {
    for (const { widget, control } of controlledNumberWidgets(node)) {
      const from = widget.value
      if (mode === 'randomize') {
        widget.value = randomValue(widget.options, random)
        widget.callback?.(widget.value)
      } else {
        // Same effect as a normal Run: exactly one of these applies, depending on the
        // "control before/after generate" setting.
        control.beforeQueued?.({ isPartialExecution: false })
        control.afterQueued?.({ isPartialExecution: false })
      }
      if (widget.value !== from) {
        changes.push({ nodeId: node.id, widget: widget.name, from, to: widget.value as number })
      }
    }
  }
  return changes
}
