<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Listbox from 'primevue/listbox'
import Textarea from 'primevue/textarea'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { ApiError, requestJson } from '@/core/apiClient'
import { confirmDialog, toast } from '@/core/comfy'

import {
  duplicateForm,
  formFromTemplate,
  isDirty,
  makeRow,
  newForm,
  syncVariables,
  type TemplateForm,
  templateFromForm,
  validateForm
} from './editorForm'
import { loadSession, saveSession } from './editorSession'
import {
  createTemplate,
  deleteTemplate,
  ensureLibraryLoaded,
  findTemplate,
  library,
  loadLibrary,
  updateTemplate
} from './libraryStore'
import { groupTemplates } from './logic'
import { API_PREFIX, type ExpandResponse, type Template } from './types'

const props = defineProps<{
  /** Template to open first. */
  initialId?: string | null
  /** Keep unsaved state across remounts under this key (used by the sidebar). */
  sessionKey?: string
}>()

const selectedId = ref<string | null>(null)
const form = ref<TemplateForm | null>(null)
const saving = ref(false)
const errorMessage = ref<string | null>(null)

const original = computed<Template | null>(() => (selectedId.value ? (findTemplate(selectedId.value) ?? null) : null))
const dirty = computed(() => form.value !== null && isDirty(form.value, original.value))
const formErrors = computed(() => (form.value ? validateForm(form.value) : []))
const readonly = computed(() => library.error?.code === 'LIBRARY_CORRUPT')
const canSave = computed(() => dirty.value && formErrors.value.length === 0 && !saving.value && !readonly.value)
const groups = computed(() => groupTemplates(library.templates))
const categories = computed(() => [...new Set(library.templates.map((t) => t.category).filter(Boolean))])
const datalistId = `nf-categories-${Math.random().toString(36).slice(2)}`

function show(template: Template | null) {
  selectedId.value = template?.id ?? null
  form.value = template ? formFromTemplate(template) : null
  errorMessage.value = null
}

function showFirst() {
  show(library.templates[0] ?? null)
}

/** Ask before throwing away unsaved edits. Exposed so the modal can ask on close. */
async function confirmDiscard(): Promise<boolean> {
  if (!form.value || !dirty.value) return true
  return confirmDialog('Discard changes?', `"${form.value.name}" has unsaved changes. Discard them?`)
}

/**
 * PrimeVue Listbox keeps its own selection and only re-syncs when model-value changes.
 * When we refuse a selection (cancelled discard, click on the selected item), bounce
 * the bound value so the list highlights the real selection again.
 */
async function resyncListSelection() {
  const keep = selectedId.value
  selectedId.value = '\u0000'
  await nextTick()
  selectedId.value = keep
}

async function select(id: string | null) {
  if (!id || id === selectedId.value || !(await confirmDiscard())) {
    await resyncListSelection()
    return
  }
  show(findTemplate(id) ?? null)
}

async function startNew() {
  if (!(await confirmDiscard())) return
  selectedId.value = null
  form.value = newForm()
  errorMessage.value = null
}

async function duplicate() {
  if (!original.value || !(await confirmDiscard())) return
  const source = original.value
  selectedId.value = null
  form.value = duplicateForm(source)
  errorMessage.value = null
}

function revert() {
  if (original.value) show(original.value)
  else showFirst()
}

function describeError(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.status === 409 && e.code === 'CONFLICT') {
      return 'The library was changed elsewhere and has been reloaded. Review your edits and save again.'
    }
    return e.message
  }
  return String(e)
}

async function save() {
  if (!form.value || !canSave.value) return
  saving.value = true
  errorMessage.value = null
  try {
    const payload = templateFromForm(form.value)
    const saved =
      form.value.id === null ? await createTemplate(payload) : await updateTemplate(form.value.id, payload)
    show(saved)
    toast('success', 'Template saved', saved.name)
  } catch (e) {
    errorMessage.value = describeError(e)
  } finally {
    saving.value = false
  }
}

async function remove() {
  const target = original.value
  if (!target) return
  if (!(await confirmDialog('Delete template?', `Delete "${target.name}" (${target.id})? This cannot be undone.`))) return
  try {
    await deleteTemplate(target.id)
    toast('success', 'Template deleted', target.name)
    showFirst()
  } catch (e) {
    errorMessage.value = describeError(e)
  }
}

async function reload() {
  await loadLibrary()
}

function addVariable() {
  form.value?.variables.push(makeRow('', ''))
}

function removeVariable(key: number) {
  if (form.value) form.value.variables = form.value.variables.filter((row) => row.key !== key)
}

function addMissingVariables() {
  if (!form.value) return
  const added = syncVariables(form.value)
  if (!added.length) toast('info', 'No missing variables')
}

// Follow changes made elsewhere (other editor, node reload) when there are no local edits.
watch(original, (next, previous) => {
  if (!form.value || form.value.id === null || !previous) return
  if (isDirty(form.value, previous)) return
  if (next) show(next)
  else showFirst()
})

// --- preview ---------------------------------------------------------------

const preview = ref<ExpandResponse | null>(null)
const previewError = ref<string | null>(null)
let previewTimer: ReturnType<typeof setTimeout> | undefined
let previewSeq = 0

watch(
  form,
  () => {
    clearTimeout(previewTimer)
    previewTimer = setTimeout(updatePreview, 300)
  },
  { deep: true }
)

async function updatePreview() {
  const seq = ++previewSeq
  if (!form.value || formErrors.value.length) {
    preview.value = null
    previewError.value = null
    return
  }
  try {
    const template = { ...templateFromForm(form.value), id: form.value.id ?? 'draft' }
    const result = await requestJson<ExpandResponse>(`${API_PREFIX}/expand`, {
      method: 'POST',
      body: JSON.stringify({ template, variables: {} })
    })
    if (seq !== previewSeq) return
    preview.value = result
    previewError.value = null
  } catch (e) {
    if (seq !== previewSeq) return
    preview.value = null
    previewError.value = describeError(e)
  }
}

// --- keyboard ----------------------------------------------------------------

function onKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault()
    void save()
  }
}

// --- lifecycle ---------------------------------------------------------------

onMounted(async () => {
  const session = loadSession(props.sessionKey)
  if (session) {
    selectedId.value = session.selectedId
    form.value = session.form
  }
  await ensureLibraryLoaded()
  if (session?.form) return
  const initial = props.initialId ? findTemplate(props.initialId) : undefined
  if (initial) show(initial)
  else showFirst()
})

onBeforeUnmount(() => {
  clearTimeout(previewTimer)
  saveSession(props.sessionKey, { selectedId: selectedId.value, form: form.value })
})

defineExpose({ confirmDiscard, select })
</script>

<template>
  <!-- nf-editor-host is the size container; @container rules can only restyle its descendants -->
  <div class="nf-editor-host">
  <div class="nf-editor" @keydown="onKeydown">
    <aside class="nf-editor-list">
      <div class="nf-row">
        <Button class="nf-button nf-grow" icon="pi pi-plus" label="New" @click="startNew" />
        <Button class="nf-icon-button" icon="pi pi-refresh" title="Reload from disk" @click="reload" />
      </div>
      <Listbox
        :model-value="selectedId"
        :options="groups"
        option-label="name"
        option-value="id"
        option-group-label="label"
        option-group-children="items"
        filter
        filter-placeholder="Search"
        empty-message="No templates"
        @update:model-value="select"
      />
    </aside>

    <section v-if="form" class="nf-editor-form">
      <div v-if="library.error" class="nf-notice" data-level="error">
        Library error: {{ library.error.message }}
      </div>

      <div class="nf-field-grid">
        <label class="nf-field-label">Name</label>
        <InputText v-model="form.name" aria-label="Template name" :invalid="formErrors.some((e) => e.field === 'name')" />

        <label class="nf-field-label">Category</label>
        <InputText v-model="form.category" aria-label="Category" :list="datalistId" placeholder="(none)" />

        <label class="nf-field-label">ID</label>
        <span class="nf-field-static">{{ form.id ?? 'assigned on first save' }}</span>
      </div>
      <datalist :id="datalistId">
        <option v-for="c in categories" :key="c" :value="c" />
      </datalist>

      <label class="nf-field-label">Template</label>
      <Textarea
        v-model="form.template"
        aria-label="Template"
        rows="4"
        auto-resize
        spellcheck="false"
        placeholder="{quality}, {character}"
      />

      <label class="nf-field-label">Negative prompt</label>
      <Textarea v-model="form.negative_prompt" aria-label="Negative prompt" rows="2" auto-resize spellcheck="false" />

      <div class="nf-row nf-section-header">
        <span class="nf-field-label nf-grow">Variables (name / default)</span>
        <Button class="nf-button" icon="pi pi-bolt" label="Add missing" title="Add variables for {placeholders} without a definition" @click="addMissingVariables" />
        <Button class="nf-button" icon="pi pi-plus" label="Add" @click="addVariable" />
      </div>
      <div v-if="form.variables.length" class="nf-var-table">
        <template v-for="row in form.variables" :key="row.key">
          <InputText v-model="row.name" placeholder="name" spellcheck="false" :aria-label="`Variable name ${row.name}`" />
          <Textarea
            v-model="row.value"
            rows="1"
            auto-resize
            spellcheck="false"
            placeholder="(empty)"
            :aria-label="`Default value of ${row.name}`"
          />
          <Button
            class="nf-icon-button"
            icon="pi pi-trash"
            :title="`Remove variable ${row.name}`"
            @click="removeVariable(row.key)"
          />
        </template>
      </div>
      <div v-else class="nf-muted">No variables</div>

      <ul v-if="formErrors.length" class="nf-errors">
        <li v-for="(e, i) in formErrors" :key="i">{{ e.message }}</li>
      </ul>

      <div class="nf-preview">
        <div class="nf-preview-label">preview (defaults)</div>
        <template v-if="preview">
          <pre class="nf-preview-text">{{ preview.positive || ' ' }}</pre>
          <pre v-if="preview.negative" class="nf-preview-text nf-preview-negative">{{ preview.negative }}</pre>
          <ul v-if="preview.warnings.length" class="nf-warnings">
            <li v-for="(w, i) in preview.warnings" :key="i">{{ w.message }}</li>
          </ul>
        </template>
        <div v-else-if="previewError" class="nf-notice" data-level="error">{{ previewError }}</div>
      </div>

      <div v-if="errorMessage" class="nf-notice" data-level="error">{{ errorMessage }}</div>

      <div class="nf-row nf-editor-actions">
        <Button
          class="nf-button nf-button-primary"
          icon="pi pi-save"
          :label="saving ? 'Saving…' : 'Save'"
          :disabled="!canSave"
          title="Save (Ctrl+S)"
          @click="save"
        />
        <Button class="nf-button" icon="pi pi-undo" label="Revert" :disabled="!dirty" @click="revert" />
        <span class="nf-grow" />
        <Button class="nf-button" icon="pi pi-copy" label="Duplicate" :disabled="!original" @click="duplicate" />
        <Button class="nf-button nf-button-danger" icon="pi pi-trash" label="Delete" :disabled="!original || readonly" @click="remove" />
      </div>
    </section>

    <section v-else class="nf-editor-form nf-editor-empty">
      <div v-if="library.error" class="nf-notice" data-level="error">Library error: {{ library.error.message }}</div>
      <p class="nf-muted">No template selected.</p>
      <Button class="nf-button" icon="pi pi-plus" label="Create a template" @click="startNew" />
    </section>
  </div>
  </div>
</template>
