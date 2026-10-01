/**
 * One Independent Queue node's run lifecycle: re-roll seeds -> queue a partial run of this
 * node's upstream -> follow the job.
 */
import { shallowRef } from 'vue'

import { type ComfyNode, getWidgetValue, isInSubgraph, nodeTitle } from '@/core/comfy'
import { type Job, queuePartial, swapClassType } from '@/core/jobs'
import { rerollSeeds, type SeedChange, type SeedMode, type SeedNode } from '@/core/seeds'

export const NODE_CLASS = 'NF_IndependentQueue'
export const RUN_CLASS = 'NF_IndependentQueueRun'

export class IndependentQueueRunner {
  readonly job = shallowRef<Job | null>(null)
  readonly queueError = shallowRef<string | null>(null)
  readonly seedChanges = shallowRef<SeedChange[]>([])
  readonly starting = shallowRef(false)

  constructor(readonly node: ComfyNode) {}

  get nodeId(): string {
    return String(this.node.id)
  }

  get supported(): boolean {
    return !isInSubgraph(this.node)
  }

  get busy(): boolean {
    const status = this.job.value?.state.status
    return this.starting.value || status === 'queued' || status === 'running'
  }

  async run(): Promise<void> {
    if (this.busy) return
    if (!this.supported) {
      this.queueError.value = 'NF Independent Queue cannot run inside a subgraph yet. Place it in the root graph.'
      return
    }
    this.starting.value = true
    this.queueError.value = null
    this.job.value?.dispose()
    try {
      const mode = getWidgetValue<SeedMode>(this.node, 'seed_mode', 'randomize')
      this.seedChanges.value = rerollSeeds(this.node as unknown as SeedNode, mode)
      if (this.seedChanges.value.length) this.node.graph?.setDirtyCanvas?.(true, true)

      this.job.value = await queuePartial({
        targetIds: [this.nodeId],
        rewrite: (prompt) => swapClassType(prompt, this.nodeId, RUN_CLASS)
      })
    } catch (e) {
      this.job.value = null
      this.queueError.value = e instanceof Error ? e.message : String(e)
    } finally {
      this.starting.value = false
    }
  }

  async cancel(): Promise<void> {
    await this.job.value?.cancel()
  }

  /** Text shown by NF_IndependentQueueRun for this node (images are shown by the host). */
  resultText(): string | null {
    const output = this.job.value?.state.outputs[this.nodeId] as { text?: unknown[] } | undefined
    const text = output?.text?.[0]
    return typeof text === 'string' ? text : null
  }

  runningTitle(): string | null {
    const id = this.job.value?.state.runningNode
    return id ? nodeTitle(id) : null
  }

  dispose(): void {
    this.job.value?.dispose()
  }
}
