<script setup lang="ts">
import Button from 'primevue/button'
import Select from 'primevue/select'
import { computed, onMounted, ref, watch } from 'vue'

import { ApiError, requestJson } from '@/core/apiClient'

import type { PromptTemplateController } from './controller'
import { ensureLibraryLoaded, findTemplate, library, loadLibrary } from './libraryStore'
import { openTemplateEditor } from './editorModal'
import { groupTemplates, type ResolveNotice, resolveTemplate } from './logic'
import { API_PREFIX, type ExpandResponse } from './types'
import VariableFields from './VariableFields.vue'

const props = defineProps<{ controller: PromptTemplateController }>()
const state = props.controller.state

// --- template selection ------------------------------------------------------

const groupedOptions = computed(() => groupTemplates(library.templates))

const selectedId = computed(() => (findTemplate(state.templateId) ? state.templateId : null))

const placeholder = computed(() => {
  if (!state.templateId) return 'Select a template'
  return `${state.snapshot?.name ?? state.templateId} (not in library)`
})

function onSelect(id: string | null) {
  if (id && id !== state.templateId) props.controller.selectTemplate(id)
}

async function reload() {
  await loadLibrary()
  props.controller.captureSnapshot()
  props.controller.fit()
}

onMounted(async () => {
  await ensureLibraryLoaded()
  props.controller.fit()
})

// --- resolution & notices ------------------------------------------------------

const resolved = computed(() =>
  resolveTemplate(state.templateId, findTemplate(state.templateId), state.snapshot, state.pinned)
)

const NOTICE_TEXT: Record<ResolveNotice, string> = {
  none: '',
  no_template: '',
  pinned: 'Pinned: using the snapshot',
  pinned_without_snapshot: 'Pinned, but this node has no snapshot',
  snapshot_outdated: 'Template changed since the last snapshot (updated on next queue)',
  template_missing: 'Template not in library: using the snapshot',
  not_found: 'Template not found and no snapshot'
}

const notice = computed(() => {
  if (library.error) return { level: 'error', text: `Library error: ${library.error.message}` }
  const n = resolved.value.notice
  if (!NOTICE_TEXT[n]) return null
  const level = n === 'not_found' || n === 'pinned_without_snapshot' ? 'error' : n === 'pinned' ? 'info' : 'warn'
  return { level, text: NOTICE_TEXT[n] }
})

// --- preview (expanded by the backend) -----------------------------------------

/** Shown for {input} while the `text` input is linked (its value is only known at run time). */
const INPUT_MARKER = '‹from input›'

const preview = ref<ExpandResponse | null>(null)
const previewError = ref<string | null>(null)
let requestSeq = 0
let debounceTimer: ReturnType<typeof setTimeout> | undefined

function schedulePreview() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(updatePreview, 250)
}

async function updatePreview() {
  const template = resolved.value.template
  const seq = ++requestSeq
  if (!template) {
    preview.value = null
    previewError.value = null
    return
  }
  try {
    const result = await requestJson<ExpandResponse>(`${API_PREFIX}/expand`, {
      method: 'POST',
      body: JSON.stringify({
        template,
        variables: state.variables,
        input_text: state.textConnected ? INPUT_MARKER : null
      })
    })
    if (seq !== requestSeq) return
    preview.value = result
    previewError.value = null
  } catch (e) {
    if (seq !== requestSeq) return
    preview.value = null
    previewError.value = e instanceof ApiError ? `[${e.code}] ${e.message}` : String(e)
  }
  props.controller.fit()
}

watch(() => [resolved.value.template, state.variables, state.textConnected], schedulePreview, {
  immediate: true,
  deep: true
})

// --- wheel: let scrollable areas scroll instead of zooming the canvas ----------

function onWheel(event: WheelEvent) {
  let el = event.target as HTMLElement | null
  while (el && el !== event.currentTarget) {
    if (el.scrollHeight > el.clientHeight && getComputedStyle(el).overflowY !== 'visible') {
      event.stopPropagation()
      return
    }
    el = el.parentElement
  }
}
</script>

<template>
  <div class="nf-root nf-pt" @wheel="onWheel">
    <div class="nf-row">
      <Select
        class="nf-grow"
        :model-value="selectedId"
        :options="groupedOptions"
        option-label="name"
        option-value="id"
        option-group-label="label"
        option-group-children="items"
        :placeholder="placeholder"
        :filter="library.templates.length > 8"
        :loading="library.loading"
        append-to="body"
        @update:model-value="onSelect"
      />
      <Button
        class="nf-icon-button"
        icon="pi pi-refresh"
        title="Reload templates"
        :disabled="library.loading"
        @click="reload"
      />
      <Button
        class="nf-icon-button"
        icon="pi pi-pencil"
        title="Edit templates"
        @click="openTemplateEditor(state.templateId || null)"
      />
    </div>

    <div v-if="notice" class="nf-notice" :data-level="notice.level">{{ notice.text }}</div>

    <VariableFields
      v-if="resolved.template"
      :defaults="resolved.template.variables"
      :values="state.variables"
      :text-connected="state.textConnected"
      @update="(name, value) => controller.setVariable(name, value)"
      @reset="(name) => controller.resetVariable(name)"
    />

    <div v-if="preview" class="nf-preview">
      <div class="nf-preview-label">positive</div>
      <pre class="nf-preview-text">{{ preview.positive || ' ' }}</pre>
      <template v-if="preview.negative">
        <div class="nf-preview-label">negative</div>
        <pre class="nf-preview-text nf-preview-negative">{{ preview.negative }}</pre>
      </template>
      <ul v-if="preview.warnings.length" class="nf-warnings">
        <li v-for="(w, i) in preview.warnings" :key="i">{{ w.message }}</li>
      </ul>
    </div>
    <div v-else-if="previewError" class="nf-notice" data-level="error">{{ previewError }}</div>
  </div>
</template>
