import { registerSidebarTab } from '@/core/comfy'
import { mountVue } from '@/core/mountVue'

import SidebarEditor from './SidebarEditor.vue'

export function registerTemplateSidebar(): void {
  let unmount: (() => void) | null = null
  registerSidebarTab({
    id: 'nf-prompt-templates',
    title: 'Prompt Templates',
    tooltip: 'NF Prompt Templates',
    icon: 'pi pi-file-edit',
    render(container) {
      unmount?.()
      unmount = mountVue(container, SidebarEditor).unmount
    },
    destroy() {
      unmount?.()
      unmount = null
    }
  })
}
