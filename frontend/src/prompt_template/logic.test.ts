import { describe, expect, it } from 'vitest'

import {
  buildSnapshot,
  filterGroups,
  foldGroups,
  groupOf,
  groupTemplates,
  parseSnapshot,
  parseVariables,
  resolveTemplate,
  sameContent
} from './logic'
import type { Snapshot, Template } from './types'

const TPL: Template = {
  id: 'scene',
  name: 'Scene',
  category: '',
  template: '{a} lib',
  negative_prompt: '',
  variables: { a: 'x' }
}
const SNAP: Snapshot = { ...TPL, template: '{a} snap', captured_at: '2026-09-30T00:00:00.000Z' }

describe('parseVariables', () => {
  it('returns {} for empty or non-string input', () => {
    expect(parseVariables('')).toEqual({})
    expect(parseVariables('   ')).toEqual({})
    expect(parseVariables(undefined)).toEqual({})
  })

  it('parses a JSON object of strings', () => {
    expect(parseVariables('{"a":"1","b":""}')).toEqual({ a: '1', b: '' })
  })

  it('drops non-string values', () => {
    expect(parseVariables('{"a":"1","b":2}')).toEqual({ a: '1' })
  })

  it.each(['{broken', '[1,2]', 'null', '"str"'])('returns {} for invalid JSON %s', (raw) => {
    expect(parseVariables(raw)).toEqual({})
  })
})

describe('parseSnapshot', () => {
  it('returns null for empty input', () => {
    expect(parseSnapshot('')).toBeNull()
  })

  it('fills missing optional fields', () => {
    expect(parseSnapshot('{"id":"a","name":"A","template":"x"}')).toEqual({
      id: 'a',
      name: 'A',
      template: 'x',
      category: '',
      negative_prompt: '',
      variables: {}
    })
  })

  it.each(['{broken', '{"id":"a"}', '{"template":"x"}'])('returns null for invalid snapshot %s', (raw) => {
    expect(parseSnapshot(raw)).toBeNull()
  })
})

describe('sameContent', () => {
  it('ignores name, category and captured_at', () => {
    expect(sameContent(TPL, { ...TPL, name: 'Other', category: 'C', captured_at: 't' } as Snapshot)).toBe(true)
  })

  it('ignores variable order', () => {
    const a = { ...TPL, variables: { a: '1', b: '2' } }
    const b = { ...TPL, variables: { b: '2', a: '1' } }
    expect(sameContent(a, b)).toBe(true)
  })

  it('detects content changes', () => {
    expect(sameContent(TPL, SNAP)).toBe(false)
    expect(sameContent(TPL, { ...TPL, negative_prompt: 'bad' })).toBe(false)
    expect(sameContent(TPL, { ...TPL, variables: { a: 'y' } })).toBe(false)
  })
})

describe('buildSnapshot', () => {
  it('serializes the template with captured_at', () => {
    const raw = buildSnapshot(TPL, new Date('2026-09-30T01:02:03.000Z'))
    expect(JSON.parse(raw)).toEqual({ ...TPL, captured_at: '2026-09-30T01:02:03.000Z' })
  })
})

describe('groupTemplates', () => {
  const t = (id: string, name: string, category: string) => ({ ...TPL, id, name, category })

  it('sorts categories and the templates in each by name, empty category last as Uncategorized', () => {
    expect(
      groupTemplates([t('a', 'Zoo', 'Scene'), t('b', 'Misc', ''), t('c', 'Hero', 'Char'), t('d', 'Alley', 'Scene')])
    ).toEqual([
      { label: 'Char', items: [{ id: 'c', name: 'Hero' }] },
      { label: 'Scene', items: [{ id: 'd', name: 'Alley' }, { id: 'a', name: 'Zoo' }] },
      { label: 'Uncategorized', items: [{ id: 'b', name: 'Misc' }] }
    ])
  })

  it('ignores case when sorting', () => {
    const groups = groupTemplates([t('a', 'beta', 'scene'), t('b', 'Alpha', 'Scene'), t('c', 'x', 'Char')])
    expect(groups.map((g) => g.label)).toEqual(['Char', 'scene', 'Scene'])
    expect(groupTemplates([t('a', 'beta', 'S'), t('b', 'Alpha', 'S')])[0].items.map((i) => i.name)).toEqual([
      'Alpha',
      'beta'
    ])
  })

  it('returns no groups for no templates', () => {
    expect(groupTemplates([])).toEqual([])
  })
})

describe('foldGroups', () => {
  const groups = [
    { label: 'Char', items: [{ id: 'c', name: 'Hero' }] },
    { label: 'Uncategorized', items: [{ id: 'b', name: 'Misc' }] }
  ]

  it('empties the groups that are not expanded, keeping their headers', () => {
    expect(foldGroups(groups, new Set(['Char']), false)).toEqual([
      groups[0],
      { label: 'Uncategorized', items: [] }
    ])
  })

  it('shows every group while filtering', () => {
    expect(foldGroups(groups, new Set(), true)).toEqual(groups)
  })
})

describe('filterGroups', () => {
  const groups = [
    { label: 'Char', items: [{ id: 'c', name: 'Hero' }, { id: 'a', name: 'Archer' }] },
    { label: 'Scene', items: [{ id: 's', name: 'Forest' }] }
  ]

  it('keeps templates whose name contains the text, ignoring case, and drops empty groups', () => {
    expect(filterGroups(groups, 'ER')).toEqual([{ label: 'Char', items: [{ id: 'c', name: 'Hero' }, { id: 'a', name: 'Archer' }] }])
    expect(filterGroups(groups, 'for')).toEqual([{ label: 'Scene', items: [{ id: 's', name: 'Forest' }] }])
  })

  it('returns the groups unchanged for blank text', () => {
    expect(filterGroups(groups, '  ')).toBe(groups)
  })
})

describe('groupOf', () => {
  it('returns the label of the group that holds the template', () => {
    const groups = [{ label: 'Char', items: [{ id: 'c', name: 'Hero' }] }]
    expect(groupOf(groups, 'c')).toBe('Char')
    expect(groupOf(groups, 'x')).toBeUndefined()
    expect(groupOf(groups, null)).toBeUndefined()
  })
})

// Must match nodes/prompt_template/resolve.py (tests/test_resolve.py)
describe('resolveTemplate', () => {
  it('uses the library template by default', () => {
    expect(resolveTemplate('scene', TPL, null, false)).toEqual({ template: TPL, source: 'library', notice: 'none' })
  })

  it('reports an outdated snapshot but uses the library', () => {
    const r = resolveTemplate('scene', TPL, SNAP, false)
    expect(r.source).toBe('library')
    expect(r.notice).toBe('snapshot_outdated')
  })

  it('has no notice when the snapshot matches', () => {
    expect(resolveTemplate('scene', TPL, { ...TPL, captured_at: 't' }, false).notice).toBe('none')
  })

  it('uses the pinned snapshot', () => {
    expect(resolveTemplate('scene', TPL, SNAP, true)).toEqual({ template: SNAP, source: 'snapshot', notice: 'pinned' })
  })

  it('reports pinned without snapshot', () => {
    expect(resolveTemplate('scene', TPL, null, true).notice).toBe('pinned_without_snapshot')
  })

  it('falls back to the snapshot of the same id', () => {
    const r = resolveTemplate('scene', undefined, SNAP, false)
    expect(r.source).toBe('snapshot')
    expect(r.notice).toBe('template_missing')
  })

  it('does not use a snapshot of another template', () => {
    expect(resolveTemplate('other', undefined, SNAP, false)).toEqual({ template: null, source: null, notice: 'not_found' })
  })

  it('reports no template for an empty id', () => {
    expect(resolveTemplate('', undefined, null, false).notice).toBe('no_template')
  })
})
