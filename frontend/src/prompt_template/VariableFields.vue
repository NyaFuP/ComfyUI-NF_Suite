<script setup lang="ts">
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'

import { INPUT_VAR } from './types'

defineProps<{
  /** Variable definitions (name -> default) of the resolved template, in display order. */
  defaults: Record<string, string>
  /** Node values. A missing key means "use the default" (backend behaviour). */
  values: Record<string, string>
  disabled?: boolean
  /** The node's `text` input is linked: the {input} field is replaced by it. */
  textConnected?: boolean
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
        v-if="textConnected && name === INPUT_VAR"
        class="nf-var-input"
        model-value=""
        placeholder="(from input)"
        title="Replaced by the connected text input"
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
        :disabled="disabled || (textConnected && name === INPUT_VAR) || (values[name] ?? def) === def"
        :title="'Reset to default'"
        @click="emit('reset', String(name))"
      />
    </div>
  </div>
</template>
