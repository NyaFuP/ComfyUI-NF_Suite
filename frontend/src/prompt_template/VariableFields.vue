<script setup lang="ts">
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'

defineProps<{
  /** Variable definitions (name -> default) of the resolved template, in display order. */
  defaults: Record<string, string>
  /** Node values. A missing key means "use the default" (backend behaviour). */
  values: Record<string, string>
  disabled?: boolean
  /** Connected link inputs: the fields of the same name are replaced by them. */
  connectedInputs?: string[]
}>()

const emit = defineEmits<{
  update: [name: string, value: string]
  reset: [name: string]
}>()
</script>

<template>
  <div v-if="Object.keys(defaults).length" class="nf-vars">
    <div v-for="(def, name) in defaults" :key="name" class="nf-var">
      <span class="nf-var-label" :title="`{${name}}`">{{ name }}</span>
      <Textarea
        v-if="connectedInputs?.includes(String(name))"
        class="nf-var-input"
        model-value=""
        :placeholder="`(from ${name})`"
        :title="`Replaced by the connected ${name} input`"
        disabled
        rows="1"
      />
      <Textarea
        v-else
        class="nf-var-input"
        :model-value="values[name] ?? def"
        :placeholder="def ? `default: ${def}` : '(empty)'"
        :disabled="disabled"
        rows="1"
        auto-resize
        spellcheck="false"
        @update:model-value="(v) => emit('update', String(name), v ?? '')"
      />
      <Button
        class="nf-icon-button"
        icon="pi pi-undo"
        :disabled="disabled || connectedInputs?.includes(String(name)) || (values[name] ?? def) === def"
        :title="'Reset to default'"
        @click="emit('reset', String(name))"
      />
    </div>
  </div>
</template>
