/**
 * Adapter layer: the ONLY place that touches the ComfyUI frontend (app, api, LiteGraph objects).
 * Everything else talks to these helpers, so frontend API changes stay contained here.
 *
 * Non-public-ish APIs used here are listed in CLAUDE.md "既知のリスク":
 *   node.addDOMWidget, widget.hidden / widget.options.hidden, widget.serialize, widget.beforeQueued
 */
import type { ComfyExtension } from '@comfyorg/comfyui-frontend-types'
import { api } from 'comfy/api'
import { app } from 'comfy/app'

export { api, app }

export type ComfyNode = Parameters<NonNullable<ComfyExtension['nodeCreated']>>[0]
type BaseWidget = NonNullable<ComfyNode['widgets']>[number]

/** Members we use that the published types do not declare. */
export type Widget = BaseWidget & {
  hidden?: boolean
  serialize?: boolean
  options: Record<string, unknown>
  callback?: (value: unknown, ...rest: unknown[]) => void
  beforeQueued?: (options?: { isPartialExecution?: boolean }) => void
  onRemove?: () => void
}

export interface DomWidgetOptions {
  getMinHeight?: () => number
  getMaxHeight?: () => number
  hideOnZoom?: boolean
  serialize?: boolean
  margin?: number
}

type NodeWithDom = ComfyNode & {
  addDOMWidget(name: string, type: string, element: HTMLElement, options?: DomWidgetOptions): Widget
}

export function registerExtension(extension: ComfyExtension): void {
  app.registerExtension(extension)
}

export function getWidget(node: ComfyNode, name: string): Widget | undefined {
  return node.widgets?.find((w) => w.name === name) as Widget | undefined
}

export function getWidgetValue<T>(node: ComfyNode, name: string, fallback: T): T {
  const widget = getWidget(node, name)
  return widget === undefined || widget.value === undefined ? fallback : (widget.value as T)
}

/** Set a widget value and redraw. Returns false when the widget does not exist. */
export function setWidgetValue(node: ComfyNode, name: string, value: unknown): boolean {
  const widget = getWidget(node, name)
  if (!widget) return false
  if (widget.value === value) return true
  widget.value = value as never
  node.setDirtyCanvas?.(true, true)
  return true
}

/**
 * Hide a widget in both renderers (LiteGraph reads widget.hidden, Nodes 2.0 reads options.hidden).
 * options must be mutated in place: Nodes 2.0 merges the options object that was registered in
 * widgetValueStore (same reference) over widget.options, so replacing the object has no effect.
 */
export function hideWidget(widget: Widget): void {
  widget.hidden = true
  widget.options.hidden = true
}

/** Call `listener` after the widget's own callback whenever the user changes it. */
export function onWidgetChange(widget: Widget, listener: (value: unknown) => void): void {
  const original = widget.callback
  widget.callback = function (this: unknown, value: unknown, ...rest: unknown[]) {
    const result = original?.call(this, value, ...rest)
    listener(value)
    return result
  }
}

/** Run `listener` after node.configure() (workflow load, paste, clone, undo). */
export function onNodeConfigured(node: ComfyNode, listener: () => void): void {
  const target = node as ComfyNode & { onConfigure?: (...args: unknown[]) => unknown }
  const original = target.onConfigure
  target.onConfigure = function (this: unknown, ...args: unknown[]) {
    const result = original?.apply(this, args)
    listener()
    return result
  }
}

/**
 * Add a DOM widget that is excluded from both the workflow JSON (widget.serialize)
 * and the API prompt (options.serialize).
 */
export function addUiWidget(
  node: ComfyNode,
  name: string,
  element: HTMLElement,
  options: DomWidgetOptions = {}
): Widget {
  const widget = (node as NodeWithDom).addDOMWidget(name, 'nf-ui', element, {
    hideOnZoom: false,
    ...options,
    serialize: false
  })
  widget.serialize = false
  return widget
}

/** Grow the node so that its widgets fit (never shrinks below the user's size). */
export function fitNodeHeight(node: ComfyNode): void {
  const computed = node.computeSize?.()
  if (!computed) return
  const [width, height] = node.size
  if (computed[1] > height) node.setSize?.([width, computed[1]])
  node.setDirtyCanvas?.(true, true)
}

export function toast(severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail?: string): void {
  app.extensionManager?.toast?.add({ severity, summary, detail, life: severity === 'error' ? 6000 : 3000 })
}

/** Host confirm dialog. Resolves true only when the user confirms. */
export async function confirmDialog(title: string, message: string): Promise<boolean> {
  const dialog = app.extensionManager?.dialog
  if (!dialog?.confirm) return window.confirm(`${title}\n\n${message}`)
  return (await dialog.confirm({ title, message })) === true
}

/**
 * Register a sidebar tab rendered by our own code (type 'custom').
 * type 'vue' cannot be used: our bundled Vue is a different runtime from the host's.
 */
export function registerSidebarTab(tab: {
  id: string
  title: string
  icon: string
  tooltip?: string
  render: (container: HTMLElement) => void
  destroy?: () => void
}): void {
  app.extensionManager.registerSidebarTab({ ...tab, type: 'custom' })
}

export function fetchApi(route: string, init?: RequestInit): Promise<Response> {
  return api.fetchApi(route, init)
}

// --- queue / jobs (used by core/jobs.ts) ----------------------------------------

export interface GraphPrompt {
  output: Record<string, unknown>
  workflow: unknown
}

export async function graphToPrompt(): Promise<GraphPrompt> {
  const { output, workflow } = await app.graphToPrompt()
  return { output: output as Record<string, unknown>, workflow }
}

/**
 * POST /prompt through the host API client (keeps auth headers and client_id).
 * Unlike app.queuePrompt this returns the prompt_id, but it does not run widgets'
 * beforeQueued hooks or register the job in the host's execution store.
 */
export async function queuePrompt(
  data: GraphPrompt,
  partialExecutionTargets: string[]
): Promise<{ prompt_id: string }> {
  const res = await api.queuePrompt(0, data as Parameters<typeof api.queuePrompt>[1], {
    partialExecutionTargets: partialExecutionTargets as never
  })
  return { prompt_id: String(res.prompt_id) }
}

export function onApiEvent(type: string, listener: (detail: unknown) => void): () => void {
  const handler = (event: Event) => listener((event as CustomEvent).detail)
  api.addEventListener(type as never, handler as never)
  return () => api.removeEventListener(type as never, handler as never)
}

export function interruptJob(promptId: string): Promise<void> {
  return api.interrupt(promptId)
}

export function deleteQueuedJob(promptId: string): Promise<void> {
  return api.deleteItem('queue', promptId)
}

/** Run `listener` with the node's UI output whenever it executes (normal Run or our partial runs). */
export function onNodeExecuted(node: ComfyNode, listener: (output: Record<string, unknown>) => void): void {
  const target = node as ComfyNode & { onExecuted?: (output: unknown) => unknown }
  const original = target.onExecuted
  target.onExecuted = function (this: unknown, output: unknown) {
    const result = original?.call(this, output)
    listener((output ?? {}) as Record<string, unknown>)
    return result
  }
}

/** node.properties is saved with the workflow but not sent in the prompt. */
export function getNodeProperty<T>(node: ComfyNode, key: string, fallback: T): T {
  const value = (node.properties as Record<string, unknown> | undefined)?.[key]
  return value === undefined ? fallback : (value as T)
}

export function setNodeProperty(node: ComfyNode, key: string, value: unknown): void {
  const target = node as unknown as { properties?: Record<string, unknown> }
  target.properties ??= {}
  target.properties[key] = value
  node.graph?.setDirtyCanvas?.(true, true)
}

export interface ImageRef {
  filename: string
  subfolder?: string
  type?: string
}

export function imageUrl(ref: ImageRef): string {
  const params = new URLSearchParams({ filename: ref.filename, subfolder: ref.subfolder ?? '', type: ref.type ?? 'temp' })
  return api.apiURL(`/view?${params}`)
}

let outputClasses: Promise<Set<string>> | null = null

/** Node classes that are output nodes (from /object_info; fetched once per session). */
export function getOutputNodeClasses(): Promise<Set<string>> {
  outputClasses ??= api
    .getNodeDefs()
    .then(
      (defs: Record<string, { output_node?: boolean }>) =>
        new Set(Object.entries(defs).filter(([, d]) => d.output_node).map(([name]) => name))
    )
    .catch((e: unknown) => {
      outputClasses = null
      throw e
    })
  return outputClasses
}

export function isVueNodesMode(): boolean {
  return app.extensionManager?.setting?.get<boolean>('Comfy.VueNodes.Enabled') === true
}

/**
 * Open the LiteGraph node context menu (the same one as right-clicking the node on the
 * canvas, including getNodeMenuItems entries) from an event on one of our DOM widgets.
 * Only needed in LiteGraph mode: there DOM widgets sit above the canvas, so the canvas
 * never sees the right-click. In Nodes 2.0 the node element opens its menu itself.
 */
export function openNodeContextMenu(node: ComfyNode, event: MouseEvent): void {
  const canvas = app.canvas as unknown as {
    adjustMouseEvent(e: MouseEvent): void
    processContextMenu(node: ComfyNode, e: MouseEvent): void
  }
  canvas.adjustMouseEvent(event)
  canvas.processContextMenu(node, event)
}

/** Title of a root-graph node by id (for progress messages). */
/** Root graph, or undefined before the app has created it (app.rootGraph logs an error then). */
function rootGraph() {
  return app.isGraphReady ? app.rootGraph : undefined
}

export function nodeTitle(nodeId: string): string {
  const node = rootGraph()?.getNodeById?.(Number(nodeId))
  return node?.title ?? `#${nodeId}`
}

/**
 * True when the node is inside a subgraph (subgraph execution ids are not supported yet).
 * During nodeCreated the node has no graph yet, so "unknown" counts as not in a subgraph.
 */
export function isInSubgraph(node: ComfyNode): boolean {
  const root = rootGraph()
  return !!node.graph && !!root && node.graph !== root
}
