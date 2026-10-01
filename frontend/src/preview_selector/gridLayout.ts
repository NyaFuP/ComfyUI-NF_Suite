/**
 * Gallery layout: the node size is the input, never the output.
 *
 * Given the area the user gave the gallery, pick the column count that makes the images
 * as large as possible, with cells of the exact image aspect ratio (so the selection
 * outline matches the image) and sizes in px. Images may scale above their natural size.
 *
 * - Near-equal options (within SAME_SIZE) prefer fewer empty cells.
 * - The previous column count is kept unless another layout is clearly larger
 *   (HYSTERESIS), so resizing near a threshold does not make the grid flip back and forth.
 */

export interface GridLayout {
  cols: number
  rows: number
  cellW: number
  cellH: number
}

export interface GridLayoutInput {
  count: number
  /** image width / height */
  aspect: number
  width: number
  height: number
  gap: number
  previousCols?: number
}

const SAME_SIZE = 0.02
const HYSTERESIS = 0.04

interface Candidate {
  cols: number
  rows: number
  size: number // cell width in px (unrounded)
  empty: number
}

function candidate(input: GridLayoutInput, cols: number): Candidate | null {
  const rows = Math.ceil(input.count / cols)
  const maxW = (input.width - input.gap * (cols - 1)) / cols
  const maxH = (input.height - input.gap * (rows - 1)) / rows
  const size = Math.min(maxW, maxH * input.aspect)
  if (!(size > 0)) return null
  return { cols, rows, size, empty: cols * rows - input.count }
}

export function computeGridLayout(input: GridLayoutInput): GridLayout | null {
  if (input.count <= 0 || input.width <= 0 || input.height <= 0 || !(input.aspect > 0)) return null

  const candidates: Candidate[] = []
  for (let cols = 1; cols <= input.count; cols++) {
    const c = candidate(input, cols)
    if (c) candidates.push(c)
  }
  if (!candidates.length) return null

  const largest = Math.max(...candidates.map((c) => c.size))
  let best = candidates
    .filter((c) => c.size >= largest * (1 - SAME_SIZE))
    .sort((a, b) => a.empty - b.empty || b.size - a.size)[0]

  const previous = candidates.find((c) => c.cols === input.previousCols)
  if (previous && previous.size >= best.size * (1 - HYSTERESIS)) best = previous

  const cellW = Math.max(1, Math.floor(best.size))
  const cellH = Math.max(1, Math.floor(best.size / input.aspect))
  return { cols: best.cols, rows: best.rows, cellW, cellH }
}
