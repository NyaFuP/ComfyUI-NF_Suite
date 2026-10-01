import './core/styles.css'

import { registerExtension } from './core/comfy'
import { attachIndependentQueueUi } from './independent_queue/attach'
import { NODE_CLASS as INDEPENDENT_QUEUE_CLASS } from './independent_queue/runner'
import { attachPreviewSelectorUi } from './preview_selector/attach'
import { NODE_CLASS as PREVIEW_SELECTOR_CLASS } from './preview_selector/logic'
import { attachPromptTemplateUi } from './prompt_template/attach'
import { registerTemplateSidebar } from './prompt_template/sidebar'
import { NODE_CLASS } from './prompt_template/types'

// Vite lib mode emits CSS as a separate file; load it next to main.js.
function loadStylesheet(): void {
  const href = new URL(/* @vite-ignore */ './main.css', import.meta.url).href
  if (document.querySelector(`link[href="${href}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

loadStylesheet()

registerExtension({
  name: 'NyaFu.NFSuite',
  setup() {
    registerTemplateSidebar()
  },
  nodeCreated(node) {
    if (node.comfyClass === NODE_CLASS) attachPromptTemplateUi(node)
    else if (node.comfyClass === INDEPENDENT_QUEUE_CLASS) attachIndependentQueueUi(node)
    else if (node.comfyClass === PREVIEW_SELECTOR_CLASS) attachPreviewSelectorUi(node)
  }
})
