import { mountVue } from '@/core/mountVue'

import EditorModal from './EditorModal.vue'

interface OpenModal {
  select: (id: string | null) => Promise<void> | undefined
}

let current: OpenModal | null = null

/** Open the template editor modal (or focus the given template if it is already open). */
export function openTemplateEditor(templateId: string | null = null): void {
  if (current) {
    void current.select(templateId)
    return
  }
  const container = document.createElement('div')
  container.className = 'nf-modal-container'
  document.body.appendChild(container)

  const mounted = mountVue(container, EditorModal, {
    initialId: templateId,
    onClose: () => {
      mounted.unmount()
      container.remove()
      current = null
    }
  })
  current = mounted.instance as unknown as OpenModal
}
