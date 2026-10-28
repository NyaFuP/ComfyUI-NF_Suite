<script setup lang="ts">
/** Category header of a foldable template list (node dropdown and editor list). */
defineProps<{ label: string; count: number; expanded: boolean }>()
defineEmits<{ toggle: [] }>()
</script>

<template>
  <div class="nf-group-toggle" :aria-expanded="expanded" @mousedown.prevent @click.stop="$emit('toggle')">
    <i :class="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" />
    <span class="nf-group-label">{{ label }}</span>
    <span class="nf-group-count">{{ count }}</span>
  </div>
</template>
