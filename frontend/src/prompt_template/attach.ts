import {
  type ComfyNode,
  addUiWidget,
  getWidget,
  hideWidget,
  onNodeConfigured,
  onWidgetChange
} from '@/core/comfy'
import { mountVue } from '@/core/mountVue'

import { PromptTemplateController } from './controller'
import PromptTemplateNode from './PromptTemplateNode.vue'
import { WIDGET } from './types'

const MIN_WIDTH = 320

/** Replace the node's raw string widgets with the Vue UI. Called from nodeCreated. */
export function attachPromptTemplateUi(node: ComfyNode): void {
  // Raw widgets stay (they are saved and queued) but are hidden. If this
  // extension fails to load, they show up as plain text fields instead.
  for (const name of [WIDGET.templateId, WIDGET.variables, WIDGET.snapshot]) {
    const widget = getWidget(node, name)
    if (widget) hideWidget(widget)
  }

  const controller = new PromptTemplateController(node)

  const pin = getWidget(node, WIDGET.pinSnapshot)
  if (pin) onWidgetChange(pin, () => controller.syncFromWidgets())
  onNodeConfigured(node, () => controller.syncFromWidgets())

  const container = document.createElement('div')
  container.className = 'nf-widget-container'

  const widget = addUiWidget(node, 'nf_prompt_template_ui', container, {
    getMinHeight: () => Math.max(60, (container.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0)
  })
  widget.beforeQueued = () => controller.captureSnapshot()

  const { unmount } = mountVue(container, PromptTemplateNode, { controller })
  const originalOnRemove = widget.onRemove
  widget.onRemove = () => {
    unmount()
    originalOnRemove?.call(widget)
  }

  if (node.size[0] < MIN_WIDTH) node.setSize?.([MIN_WIDTH, node.size[1]])
}
