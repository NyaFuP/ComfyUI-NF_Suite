import { type ComfyNode, addUiWidget, fitNodeHeight } from '@/core/comfy'
import { mountVue } from '@/core/mountVue'

import IndependentQueueNode from './IndependentQueueNode.vue'
import { IndependentQueueRunner } from './runner'

const MIN_WIDTH = 300

/** Add the Run/Cancel UI to an NF_IndependentQueue node. Called from nodeCreated. */
export function attachIndependentQueueUi(node: ComfyNode): void {
  const runner = new IndependentQueueRunner(node)

  const container = document.createElement('div')
  container.className = 'nf-widget-container'
  const widget = addUiWidget(node, 'nf_independent_queue_ui', container, {
    getMinHeight: () => Math.max(40, (container.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0)
  })

  const { unmount } = mountVue(container, IndependentQueueNode, { runner })
  const originalOnRemove = widget.onRemove
  widget.onRemove = () => {
    unmount()
    originalOnRemove?.call(widget)
  }

  // Grow the node when results appear (LiteGraph sizes DOM widgets from getMinHeight).
  new ResizeObserver(() => fitNodeHeight(node)).observe(container)

  if (node.size[0] < MIN_WIDTH) node.setSize?.([MIN_WIDTH, node.size[1]])
}
