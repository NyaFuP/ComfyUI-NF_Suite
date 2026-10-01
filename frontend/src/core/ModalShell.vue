<script setup lang="ts">
import Button from 'primevue/button'
import { onMounted, ref } from 'vue'

/**
 * Generic modal frame mounted on document.body by openModal().
 * It never closes itself: it emits `close-request` (Esc, backdrop, ×) and the owner
 * decides (e.g. after asking about unsaved changes).
 */
defineProps<{ title: string }>()
const emit = defineEmits<{ 'close-request': [] }>()

const panel = ref<HTMLElement>()

function onKeydown(event: KeyboardEvent) {
  // Keep ComfyUI shortcuts (Ctrl+Z, Ctrl+S, Delete...) from acting on the graph while the modal is open.
  event.stopPropagation()
  if (event.key === 'Escape') emit('close-request')
}

onMounted(() => panel.value?.focus())
</script>

<template>
  <div class="nf-modal-backdrop" @mousedown.self="emit('close-request')" @keydown="onKeydown">
    <div ref="panel" class="nf-modal nf-root" role="dialog" aria-modal="true" :aria-label="title" tabindex="-1">
      <header class="nf-modal-header">
        <span class="nf-modal-title">{{ title }}</span>
        <Button class="nf-icon-button" icon="pi pi-times" title="Close" @click="emit('close-request')" />
      </header>
      <div class="nf-modal-body">
        <slot />
      </div>
    </div>
  </div>
</template>
