import { describe, expect, it } from 'vitest'

import {
  duplicateForm,
  findPlaceholders,
  formFromTemplate,
  isDirty,
  newForm,
  syncVariables,
  templateFromForm,
  validateForm
} from './editorForm'
import type { Template } from './types'

const TPL: Template = {
  id: 'scene',
  name: 'Scene',
  category: 'Cat',
  template: '{a}, {b}',
  negative_prompt: 'bad {c}',
  variables: { a: 'x', b: '', c: 'z' }
}

describe('formFromTemplate / templateFromForm', () => {
  it('round-trips a template', () => {
    expect(templateFromForm(formFromTemplate(TPL))).toEqual(TPL)
  })

  it('keeps variable order', () => {
    const t = { ...TPL, variables: { z: '1', a: '2', m: '3' } }
    expect(Object.keys(templateFromForm(formFromTemplate(t)).variables)).toEqual(['z', 'a', 'm'])
  })

  it('preserves unknown fields', () => {
    const t = { ...TPL, note: 'keep' }
    expect(templateFromForm(formFromTemplate(t)).note).toBe('keep')
  })

  it('omits id for a new template', () => {
    expect('id' in templateFromForm(newForm())).toBe(false)
  })

  it('gives each variable row a unique key', () => {
    const keys = formFromTemplate(TPL).variables.map((r) => r.key)
    expect(new Set(keys).size).toBe(keys.length)
  })
})

describe('validateForm', () => {
  it('accepts a valid form', () => {
    expect(validateForm(formFromTemplate(TPL))).toEqual([])
  })

  it('requires a name', () => {
    const f = formFromTemplate({ ...TPL, name: '  ' })
    expect(validateForm(f).map((e) => e.field)).toEqual(['name'])
  })

  it('rejects invalid variable names', () => {
    const f = formFromTemplate(TPL)
    f.variables[0].name = 'bad name'
    expect(validateForm(f)).toEqual([{ field: 'variables', message: expect.stringContaining('bad name') }])
  })

  it('rejects duplicate variable names', () => {
    const f = formFromTemplate(TPL)
    f.variables[1].name = 'a'
    expect(validateForm(f)).toEqual([{ field: 'variables', message: expect.stringContaining("'a'") }])
  })
})

describe('isDirty', () => {
  it('is false for an untouched form', () => {
    expect(isDirty(formFromTemplate(TPL), TPL)).toBe(false)
  })

  it('is true after an edit', () => {
    const f = formFromTemplate(TPL)
    f.template = 'changed'
    expect(isDirty(f, TPL)).toBe(true)
  })

  it('is true when a variable is renamed', () => {
    const f = formFromTemplate(TPL)
    f.variables[0].name = 'renamed'
    expect(isDirty(f, TPL)).toBe(true)
  })

  it('is always true for an unsaved new template', () => {
    expect(isDirty(newForm(), null)).toBe(true)
  })
})

describe('findPlaceholders', () => {
  it('finds identifier placeholders in order without duplicates', () => {
    expect(findPlaceholders('{b}, {a}, {b}', 'x {c}')).toEqual(['b', 'a', 'c'])
  })

  it('ignores non-identifier braces', () => {
    expect(findPlaceholders('{red|blue} {{x}} { a } {1x}')).toEqual([])
  })
})

describe('syncVariables', () => {
  it('adds rows for placeholders that have no variable', () => {
    const f = formFromTemplate({ ...TPL, template: '{a}, {new1}', negative_prompt: '{new2}', variables: { a: 'x' } })
    const added = syncVariables(f)
    expect(added).toEqual(['new1', 'new2'])
    expect(f.variables.map((r) => [r.name, r.value])).toEqual([
      ['a', 'x'],
      ['new1', ''],
      ['new2', '']
    ])
  })

  it('does nothing when every placeholder is defined', () => {
    const f = formFromTemplate(TPL)
    expect(syncVariables(f)).toEqual([])
    expect(f.variables).toHaveLength(3)
  })
})

describe('newForm / duplicateForm', () => {
  it('creates an empty new form', () => {
    const f = newForm()
    expect(f.id).toBeNull()
    expect(f.name).toBe('New template')
    expect(f.variables).toEqual([])
  })

  it('duplicates a template without its id', () => {
    const f = duplicateForm(TPL)
    expect(f.id).toBeNull()
    expect(f.name).toBe('Scene (copy)')
    expect(templateFromForm(f).variables).toEqual(TPL.variables)
  })
})
