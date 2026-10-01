import { describe, expect, it } from 'vitest'

import { computeGridLayout } from './gridLayout'

const GAP = 4

function fits(l: NonNullable<ReturnType<typeof computeGridLayout>>, width: number, height: number) {
  return l.cols * l.cellW + GAP * (l.cols - 1) <= width && l.rows * l.cellH + GAP * (l.rows - 1) <= height
}

describe('computeGridLayout', () => {
  it('returns null for an empty batch or a collapsed area', () => {
    expect(computeGridLayout({ count: 0, aspect: 1, width: 300, height: 300, gap: GAP })).toBeNull()
    expect(computeGridLayout({ count: 4, aspect: 1, width: 0, height: 300, gap: GAP })).toBeNull()
  })

  it('wide area -> one row, tall area -> one column, square area -> 2x2', () => {
    expect(computeGridLayout({ count: 4, aspect: 1, width: 800, height: 200, gap: GAP })).toMatchObject({ cols: 4, rows: 1 })
    expect(computeGridLayout({ count: 4, aspect: 1, width: 200, height: 800, gap: GAP })).toMatchObject({ cols: 1, rows: 4 })
    expect(computeGridLayout({ count: 4, aspect: 1, width: 400, height: 400, gap: GAP })).toMatchObject({ cols: 2, rows: 2 })
  })

  it('cells keep the image aspect ratio and fit inside the area', () => {
    for (const [w, h] of [[300, 500], [640, 240], [333, 333], [1000, 1000]]) {
      const l = computeGridLayout({ count: 5, aspect: 2 / 3, width: w, height: h, gap: GAP })!
      expect(fits(l, w, h)).toBe(true)
      expect(Math.abs(l.cellW / l.cellH - 2 / 3)).toBeLessThan(0.02)
    }
  })

  it('images grow with the area (no upper limit at the natural size)', () => {
    const small = computeGridLayout({ count: 1, aspect: 1, width: 100, height: 100, gap: GAP })!
    const large = computeGridLayout({ count: 1, aspect: 1, width: 1000, height: 1000, gap: GAP })!
    expect(small.cellW).toBe(100)
    expect(large.cellW).toBe(1000)
  })

  it('prefers fewer empty cells when the image size is about the same', () => {
    // 6 square images in a 3:2 area: 3x2 (no empty cell) beats 4x2 / 2x3 at equal size
    expect(computeGridLayout({ count: 6, aspect: 1, width: 608, height: 404, gap: GAP })).toMatchObject({ cols: 3, rows: 2 })
  })

  it('keeps the previous column count near a threshold (no flip-flopping)', () => {
    // 400x200 with 4 squares: 2x2 gives 98px cells, 4x1 gives 97px (about 1% apart).
    const base = { count: 4, aspect: 1, width: 400, height: 200, gap: GAP }
    expect(computeGridLayout(base)!.cols).toBe(2)
    expect(computeGridLayout({ ...base, previousCols: 4 })!.cols).toBe(4)
  })

  it('switches when the alternative is clearly better', () => {
    const l = computeGridLayout({ count: 4, aspect: 1, width: 300, height: 300, gap: GAP, previousCols: 4 })!
    expect(l.cols).toBe(2)
  })
})
