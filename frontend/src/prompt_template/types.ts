export interface Template {
  id: string
  name: string
  category: string
  template: string
  negative_prompt: string
  variables: Record<string, string>
  [extra: string]: unknown
}

export interface Snapshot extends Template {
  captured_at?: string
}

export interface LibraryResponse {
  version: number
  revision: string
  templates: Template[]
  warnings: unknown[]
}

export interface ExpandWarning {
  code: string
  message: string
  var?: string
  field?: 'positive' | 'negative'
}

export interface ExpandResponse {
  positive: string
  negative: string
  warnings: ExpandWarning[]
}

/** Names of the node's hidden widgets (must match nodes/prompt_template/node.py). */
export const WIDGET = {
  templateId: 'template_id',
  variables: 'variables',
  snapshot: 'snapshot',
  pinSnapshot: 'pin_snapshot'
} as const

/**
 * The node's optional link inputs. Each one, when connected, replaces the variable of the same
 * name (input1 is meant for the positive prompt, input2 for the negative). Keep in sync with
 * INPUT_VARS in nodes/prompt_template/expand.py.
 */
export const INPUT_VARS = ['input1', 'input2'] as const

export const NODE_CLASS = 'NF_PromptTemplate'
export const API_PREFIX = '/nyafu/prompt_template'
