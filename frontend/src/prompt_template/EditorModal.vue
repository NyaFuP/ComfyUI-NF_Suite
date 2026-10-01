<script setup lang="ts">
import { ref } from 'vue'

import ModalShell from '@/core/ModalShell.vue'

import TemplateEditor from './TemplateEditor.vue'

const props = defineProps<{ initialId: string | null; onClose: () => void }>()

const editor = ref<InstanceType<typeof TemplateEditor>>()

async function requestClose() {
  if (await (editor.value?.confirmDiscard() ?? true)) props.onClose()
}

defineExpose({ select: (id: string | null) => editor.value?.select(id) })
</script>

<template>
  <ModalShell title="Prompt Templates" @close-request="requestClose">
    <TemplateEditor ref="editor" :initial-id="initialId" />
  </ModalShell>
</template>
