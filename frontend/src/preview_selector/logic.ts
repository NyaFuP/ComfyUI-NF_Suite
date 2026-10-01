/** Pure helpers for NF Preview Selector (no Vue, no ComfyUI). */
import { type ApiPrompt, collectAncestors } from '@/core/prompt'

export const NODE_CLASS = 'NF_PreviewSelector'
export const SOURCE_CLASS = 'NF_PreviewSelectorSource'

/** Output nodes that depend on `selectorId` (the [Continue] targets). */
export function downstreamOutputs(
  prompt: ApiPrompt,
  selectorId: string,
  isOutput: (classType: string) => boolean
): string[] {
  return Object.keys(prompt).filter(
    (id) => id !== selectorId && isOutput(prompt[id].class_type) && collectAncestors(prompt, id).has(selectorId)
  )
}

export function formatSelection(indices: number[]): string {
  return [...new Set(indices)].sort((a, b) => a - b).join(',')
}

export function toggleIndex(selection: number[], index: number): number[] {
  return selection.includes(index)
    ? selection.filter((i) => i !== index)
    : [...selection, index].sort((a, b) => a - b)
}

/**
 * [Continue]: replace the selector with the source variant. It has no link inputs, so the
 * upstream branch is not part of the run; it loads the stored batch instead.
 */
export function buildContinuePrompt(
  prompt: ApiPrompt,
  selectorId: string,
  batchId: string,
  selection: number[]
): ApiPrompt {
  const node = prompt[selectorId]
  if (!node) throw new Error(`Node ${selectorId} is not in the prompt (muted or bypassed?)`)
  return {
    ...prompt,
    [selectorId]: {
      ...node,
      class_type: SOURCE_CLASS,
      inputs: { batch_id: batchId, selection: formatSelection(selection) }
    }
  }
}
