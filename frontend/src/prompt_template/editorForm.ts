/**
 * Editor form model (pure, no Vue/ComfyUI).
 * Variables are edited as ordered rows so they can be renamed/reordered; they are
 * converted back to the `{name: default}` object on save.
 */
import type { Template } from './types'

export interface VariableRow {
  key: number
  name: string
  value: string
}

export interface TemplateForm {
  /** null for a template that has not been saved yet (the server generates the id). */
  id: string | null
  name: string
  category: string
  template: string
  negative_prompt: string
  variables: VariableRow[]
  /** Unknown fields, preserved on save. */
  extra: Record<string, unknown>
}

export interface FormError {
  field: 'name' | 'variables'
  message: string
}

/** Payload for POST/PUT (id is omitted for new templates). */
export interface TemplatePayload {
  id?: string
  name: string
  category: string
  template: string
  negative_prompt: string
  variables: Record<string, string>
  [extra: string]: unknown
}

// `{name}` but not `{{name}}`. Keep in sync with PLACEHOLDER_RE in nodes/prompt_template/expand.py.
const PLACEHOLDER_RE = /(?<!\{)\{([A-Za-z_][A-Za-z0-9_]*)\}(?!\})/g
const VARIABLE_NAME_RE = /^[A-Za-z_][A-Za-z0-9_]*$/
const KNOWN_FIELDS = new Set(['id', 'name', 'category', 'template', 'negative_prompt', 'variables'])

let nextRowKey = 1

export function makeRow(name = '', value = ''): VariableRow {
  return { key: nextRowKey++, name, value }
}

export function formFromTemplate(template: Template): TemplateForm {
  const extra = Object.fromEntries(Object.entries(template).filter(([k]) => !KNOWN_FIELDS.has(k)))
  return {
    id: template.id,
    name: template.name,
    category: template.category ?? '',
    template: template.template,
    negative_prompt: template.negative_prompt ?? '',
    variables: Object.entries(template.variables ?? {}).map(([name, value]) => makeRow(name, value)),
    extra
  }
}

export function newForm(): TemplateForm {
  return { id: null, name: 'New template', category: '', template: '', negative_prompt: '', variables: [], extra: {} }
}

export function duplicateForm(template: Template): TemplateForm {
  return { ...formFromTemplate(template), id: null, name: `${template.name} (copy)` }
}

export function templateFromForm(form: TemplateForm): TemplatePayload {
  const payload: TemplatePayload = {
    ...form.extra,
    name: form.name,
    category: form.category,
    template: form.template,
    negative_prompt: form.negative_prompt,
    variables: Object.fromEntries(form.variables.map((row) => [row.name, row.value]))
  }
  return form.id === null ? payload : { id: form.id, ...payload }
}

export function validateForm(form: TemplateForm): FormError[] {
  const errors: FormError[] = []
  if (!form.name.trim()) errors.push({ field: 'name', message: 'Name is required' })

  const seen = new Set<string>()
  for (const row of form.variables) {
    if (!VARIABLE_NAME_RE.test(row.name)) {
      errors.push({ field: 'variables', message: `Invalid variable name '${row.name}' (letters, digits and _ only)` })
    } else if (seen.has(row.name)) {
      errors.push({ field: 'variables', message: `Duplicate variable name '${row.name}'` })
    }
    seen.add(row.name)
  }
  return errors
}

function comparable(value: TemplatePayload): string {
  return JSON.stringify(value, Object.keys(value).sort())
}

/** True when the form differs from the saved template (always true for unsaved new ones). */
export function isDirty(form: TemplateForm, original: Template | null): boolean {
  if (original === null || form.id === null) return true
  const current = templateFromForm(form)
  const saved = templateFromForm(formFromTemplate(original))
  return (
    comparable(current) !== comparable(saved) ||
    JSON.stringify(Object.entries(current.variables)) !== JSON.stringify(Object.entries(saved.variables))
  )
}

/** `{identifier}` placeholders in order of first appearance. */
export function findPlaceholders(...texts: string[]): string[] {
  const found: string[] = []
  for (const text of texts) {
    for (const match of text.matchAll(PLACEHOLDER_RE)) {
      if (!found.includes(match[1])) found.push(match[1])
    }
  }
  return found
}

/** Add empty rows for placeholders that have no variable yet. Returns the added names. */
export function syncVariables(form: TemplateForm): string[] {
  const defined = new Set(form.variables.map((row) => row.name))
  const added = findPlaceholders(form.template, form.negative_prompt).filter((name) => !defined.has(name))
  for (const name of added) form.variables.push(makeRow(name, ''))
  return added
}
