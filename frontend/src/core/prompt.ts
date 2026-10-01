/** API-format prompt helpers (pure, no ComfyUI imports). */

export interface ApiPromptNode {
  class_type: string
  inputs: Record<string, unknown>
  [extra: string]: unknown
}
export type ApiPrompt = Record<string, ApiPromptNode>

export function swapClassType(prompt: ApiPrompt, nodeId: string, classType: string): ApiPrompt {
  if (!prompt[nodeId]) throw new Error(`Node ${nodeId} is not in the prompt (muted or bypassed?)`)
  return { ...prompt, [nodeId]: { ...prompt[nodeId], class_type: classType } }
}

function isLink(value: unknown): value is [string, number] {
  return Array.isArray(value) && value.length === 2 && typeof value[1] === 'number'
}

/** Ids of all nodes `nodeId` depends on (transitively). */
export function collectAncestors(prompt: ApiPrompt, nodeId: string): Set<string> {
  const found = new Set<string>()
  const stack = [nodeId]
  while (stack.length) {
    const node = prompt[stack.pop()!]
    if (!node) continue
    for (const value of Object.values(node.inputs ?? {})) {
      if (!isLink(value)) continue
      const origin = String(value[0])
      if (!found.has(origin)) {
        found.add(origin)
        stack.push(origin)
      }
    }
  }
  return found
}
