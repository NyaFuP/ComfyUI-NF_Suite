import { type ComfyNode, addUiWidget } from '@/core/comfy'
import { mountVue } from '@/core/mountVue'

import { PreviewSelectorController } from './controller'
import PreviewSelectorNode from './PreviewSelectorNode.vue'

// Initial size for a new node only. After that the node size belongs to the user:
// nothing here resizes the node when candidates arrive.
const INITIAL_SIZE: [number, number] = [420, 480]

/** Add the gallery UI to an NF_PreviewSelector node. Called from nodeCreated. */
export function attachPreviewSelectorUi(node: ComfyNode): void {
  const controller = new PreviewSelectorController(node)

  const container = document.createElement('div')
  container.className = 'nf-widget-container nf-ps-container'
  // Flexible height: the widget takes whatever height the node gives it.
  // (Do not set computeSize: it switches LiteGraph to a fixed-height layout.)
  const widget = addUiWidget(node, 'nf_preview_selector_ui', container, { getMinHeight: () => 120 })

  const { unmount } = mountVue(container, PreviewSelectorNode, { controller })
  const originalOnRemove = widget.onRemove
  widget.onRemove = () => {
    unmount()
    originalOnRemove?.call(widget)
  }

  const [w, h] = node.size
  if (w < INITIAL_SIZE[0] || h < INITIAL_SIZE[1]) {
    node.setSize?.([Math.max(w, INITIAL_SIZE[0]), Math.max(h, INITIAL_SIZE[1])])
  }
}
