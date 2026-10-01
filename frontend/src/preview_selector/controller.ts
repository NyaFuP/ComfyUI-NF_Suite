/**
 * One NF Preview Selector node: candidates, selection, [Generate] and [Continue].
 *
 * State lives in node.properties (saved with the workflow, not sent in the prompt).
 * Candidates arrive through node.onExecuted for both a normal Run and [Generate].
 */
import { reactive, shallowRef } from 'vue'

import {
  type ComfyNode,
  getNodeProperty,
  getOutputNodeClasses,
  getWidgetValue,
  type ImageRef,
  isInSubgraph,
  onNodeConfigured,
  onNodeExecuted,
  setNodeProperty
} from '@/core/comfy'
import { type Job, queuePartial } from '@/core/jobs'
import { rerollSeeds, type SeedMode, type SeedNode } from '@/core/seeds'

import { type ContextClick, menuTargetIndex } from './contextMenu'
import { buildContinuePrompt, downstreamOutputs, toggleIndex } from './logic'

const PROPERTY = 'nf_preview_selector'

// node -> controller, for the node context menu (getNodeMenuItems receives only the node)
const controllers = new WeakMap<object, PreviewSelectorController>()

export function getController(node: object): PreviewSelectorController | undefined {
  return controllers.get(node)
}

interface Persisted {
  batchId: string | null
  candidates: ImageRef[]
  selection: number[]
}

export type Action = 'generate' | 'continue'

export class PreviewSelectorController {
  readonly state = reactive<Persisted & { expired: boolean }>({
    batchId: null,
    candidates: [],
    selection: [],
    expired: false
  })
  readonly job = shallowRef<Job | null>(null)
  readonly action = shallowRef<Action | null>(null)
  readonly queueError = shallowRef<string | null>(null)
  readonly starting = shallowRef(false)

  private contextClick: ContextClick | null = null

  constructor(readonly node: ComfyNode) {
    controllers.set(node, this)
    this.restore()
    onNodeConfigured(node, () => this.restore())
    onNodeExecuted(node, (output) => this.receive(output))
  }

  get nodeId(): string {
    return String(this.node.id)
  }

  get busy(): boolean {
    const status = this.job.value?.state.status
    return this.starting.value || status === 'queued' || status === 'running'
  }

  get canContinue(): boolean {
    return !this.busy && !!this.state.batchId && this.state.selection.length > 0 && !this.state.expired
  }

  // --- state ---------------------------------------------------------------------

  private restore(): void {
    const saved = getNodeProperty<Partial<Persisted>>(this.node, PROPERTY, {})
    this.state.batchId = saved.batchId ?? null
    this.state.candidates = saved.candidates ?? []
    this.state.selection = saved.selection ?? []
    this.state.expired = false
  }

  private persist(): void {
    const { batchId, candidates, selection } = this.state
    setNodeProperty(this.node, PROPERTY, { batchId, candidates: [...candidates], selection: [...selection] })
  }

  private receive(output: Record<string, unknown>): void {
    const candidates = output.nf_candidates as ImageRef[] | undefined
    const batch = output.nf_batch as string[] | undefined
    if (!candidates || !batch?.length) return
    this.state.candidates = candidates
    this.state.batchId = batch[0]
    this.state.selection = []
    this.state.expired = false
    this.persist()
  }

  /** Remember which image was right-clicked, for the node menu that opens next. */
  noteContextClick(index: number): void {
    this.contextClick = { index, at: Date.now() }
  }

  /** Index the node menu's image items act on, or null when there is nothing to act on. */
  menuTarget(): number | null {
    if (this.state.expired) return null
    return menuTargetIndex({
      clicked: this.contextClick,
      selection: this.state.selection,
      count: this.state.candidates.length,
      now: Date.now()
    })
  }

  /** Called when a candidate image fails to load (temp files are removed on restart). */
  markExpired(): void {
    this.state.expired = true
  }

  toggle(index: number): void {
    if (this.busy) return
    this.state.selection = toggleIndex(this.state.selection, index)
    this.persist()
  }

  selectAll(): void {
    this.state.selection = this.state.candidates.map((_, i) => i)
    this.persist()
  }

  clearSelection(): void {
    this.state.selection = []
    this.persist()
  }

  // --- runs --------------------------------------------------------------------------

  private async start(action: Action, queue: () => Promise<Job>): Promise<void> {
    if (this.busy) return
    if (isInSubgraph(this.node)) {
      this.queueError.value = 'NF Preview Selector buttons cannot run inside a subgraph yet. Place it in the root graph.'
      return
    }
    this.starting.value = true
    this.action.value = action
    this.queueError.value = null
    this.job.value?.dispose()
    try {
      this.job.value = await queue()
    } catch (e) {
      this.job.value = null
      this.queueError.value = e instanceof Error ? e.message : String(e)
    } finally {
      this.starting.value = false
    }
  }

  /** Re-run the upstream branch to get new candidates (downstream stays blocked). */
  generate(): Promise<void> {
    return this.start('generate', () => {
      const mode = getWidgetValue<SeedMode>(this.node, 'seed_mode', 'randomize')
      if (rerollSeeds(this.node as unknown as SeedNode, mode).length) this.node.graph?.setDirtyCanvas?.(true, true)
      return queuePartial({ targetIds: [this.nodeId] })
    })
  }

  /** Run only the downstream outputs with the selected candidates. */
  continue(): Promise<void> {
    if (!this.canContinue) return Promise.resolve()
    const { batchId, selection } = this.state
    return this.start('continue', async () => {
      const outputs = await getOutputNodeClasses()
      return queuePartial({
        rewrite: (prompt) => buildContinuePrompt(prompt, this.nodeId, batchId!, selection),
        targetIds: (prompt) => {
          const targets = downstreamOutputs(prompt, this.nodeId, (c) => outputs.has(c))
          if (!targets.length) throw new Error('Nothing to continue: connect an output node (e.g. Save Image) after this node.')
          return targets
        }
      })
    })
  }

  async cancel(): Promise<void> {
    await this.job.value?.cancel()
  }

  dispose(): void {
    this.job.value?.dispose()
  }
}
