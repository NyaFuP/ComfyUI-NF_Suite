/**
 * Per-node state bridge between the node's hidden widgets and the Vue UI.
 * The widgets are the source of truth (they are what gets saved and queued);
 * `state` is a reactive mirror refreshed after configure / widget changes.
 */
import { reactive } from 'vue'

import { type ComfyNode, fitNodeHeight, getWidgetValue, isInputConnected, setWidgetValue } from '@/core/comfy'

import { findTemplate } from './libraryStore'
import { buildSnapshot, parseSnapshot, parseVariables, sameContent } from './logic'
import { INPUT_VARS, type Snapshot, WIDGET } from './types'

export interface NodeState {
  templateId: string
  variables: Record<string, string>
  snapshot: Snapshot | null
  pinned: boolean
  /** Link inputs (input1 / input2) that are connected: their variables come from other nodes. */
  connectedInputs: string[]
}

export class PromptTemplateController {
  readonly state: NodeState

  constructor(readonly node: ComfyNode) {
    this.state = reactive<NodeState>({
      templateId: '',
      variables: {},
      snapshot: null,
      pinned: false,
      connectedInputs: []
    })
    this.syncFromWidgets()
  }

  syncFromWidgets(): void {
    this.state.templateId = String(getWidgetValue(this.node, WIDGET.templateId, ''))
    this.state.variables = parseVariables(getWidgetValue(this.node, WIDGET.variables, '{}'))
    this.state.snapshot = parseSnapshot(getWidgetValue(this.node, WIDGET.snapshot, ''))
    this.state.pinned = Boolean(getWidgetValue(this.node, WIDGET.pinSnapshot, false))
    this.syncConnections()
  }

  syncConnections(): void {
    this.state.connectedInputs = INPUT_VARS.filter((name) => isInputConnected(this.node, name))
  }

  /** Select a template: reset variable values to its defaults and capture a snapshot. */
  selectTemplate(id: string): void {
    const template = findTemplate(id)
    this.writeTemplateId(id)
    this.writeVariables({ ...(template?.variables ?? {}) })
    this.captureSnapshot()
    this.fit()
  }

  setVariable(name: string, value: string): void {
    this.writeVariables({ ...this.state.variables, [name]: value })
  }

  resetVariable(name: string): void {
    const defaults = findTemplate(this.state.templateId)?.variables ?? this.state.snapshot?.variables ?? {}
    this.setVariable(name, defaults[name] ?? '')
  }

  /**
   * Store the current library content as the snapshot (skipped when pinned or unknown).
   * Only rewritten when the content changed, so queueing does not mark the workflow modified.
   */
  captureSnapshot(): void {
    // Widgets are the source of truth; the mirror may be stale if something else wrote them.
    this.syncFromWidgets()
    if (this.state.pinned) return
    const template = findTemplate(this.state.templateId)
    if (!template) return
    const current = this.state.snapshot
    if (current && current.id === template.id && sameContent(current, template)) return
    const raw = buildSnapshot(template)
    setWidgetValue(this.node, WIDGET.snapshot, raw)
    this.state.snapshot = parseSnapshot(raw)
  }

  fit(): void {
    requestAnimationFrame(() => fitNodeHeight(this.node))
  }

  private writeTemplateId(id: string): void {
    setWidgetValue(this.node, WIDGET.templateId, id)
    this.state.templateId = id
  }

  private writeVariables(variables: Record<string, string>): void {
    setWidgetValue(this.node, WIDGET.variables, JSON.stringify(variables))
    this.state.variables = variables
  }
}
