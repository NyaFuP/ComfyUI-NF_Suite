import { describe, expect, it } from 'vitest'

import { CONTEXT_TARGET_TTL, menuTargetIndex } from './contextMenu'

const base = { selection: [] as number[], count: 4, now: 10_000 }

describe('menuTargetIndex', () => {
  it('uses the image that was just right-clicked', () => {
    expect(menuTargetIndex({ ...base, clicked: { index: 2, at: 9_900 } })).toBe(2)
  })

  it('ignores a stale right-click (e.g. the title was right-clicked later)', () => {
    expect(menuTargetIndex({ ...base, clicked: { index: 2, at: 10_000 - CONTEXT_TARGET_TTL - 1 } })).toBe(0)
  })

  it('falls back to the first selected image', () => {
    expect(menuTargetIndex({ ...base, selection: [3, 1], clicked: null })).toBe(1)
  })

  it('falls back to the first image', () => {
    expect(menuTargetIndex({ ...base, clicked: null })).toBe(0)
  })

  it('returns null without candidates', () => {
    expect(menuTargetIndex({ ...base, count: 0, clicked: { index: 0, at: 9_999 } })).toBeNull()
  })

  it('ignores an index that is out of range (batch changed)', () => {
    expect(menuTargetIndex({ ...base, count: 2, clicked: { index: 3, at: 9_999 } })).toBe(0)
  })
})
