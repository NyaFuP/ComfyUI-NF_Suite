/**
 * Node context menu items for NF Preview Selector (Copy / Open / Save Image).
 *
 * The browser's own image menu is not used: the images must not receive pointer events,
 * otherwise wheel zoom over the gallery stops working (see CLAUDE.md).
 */

/** A right-click on an image only counts for the menu opened right after it. */
export const CONTEXT_TARGET_TTL = 1500

export interface ContextClick {
  index: number
  at: number
}

/** Image the menu acts on: the one just right-clicked, else the first selected, else the first. */
export function menuTargetIndex(input: {
  clicked: ContextClick | null
  selection: number[]
  count: number
  now: number
}): number | null {
  const { clicked, selection, count, now } = input
  if (count <= 0) return null
  if (clicked && now - clicked.at <= CONTEXT_TARGET_TTL && clicked.index < count) return clicked.index
  const firstSelected = [...selection].sort((a, b) => a - b).find((i) => i < count)
  return firstSelected ?? 0
}
