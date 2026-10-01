<script setup lang="ts">
import TemplateEditor from './TemplateEditor.vue'

// Stop keydown so ComfyUI shortcuts (Ctrl+Z, Delete...) don't act on the graph
// while working in the sidebar.
</script>

<template>
  <div class="nf-root nf-sidebar" @keydown.stop>
    <header class="nf-sidebar-header">Prompt Templates</header>
    <TemplateEditor session-key="sidebar" />
  </div>
</template>
