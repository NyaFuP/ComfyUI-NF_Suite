import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PromptTemplateController } from './controller'
import { library } from './libraryStore'
import type { Template } from './types'

// Replace the ComfyUI adapter with plain widget access on a fake node.
vi.mock('@/core/comfy', () => {
  type FakeNode = { widgets: { name: string; value: unknown }[]; inputs?: { name: string; link: number | null }[] }
  const find = (node: FakeNode, name: string) => node.widgets.find((w) => w.name === name)
  return {
    getWidgetValue: (node: FakeNode, name: string, fallback: unknown) => find(node, name)?.value ?? fallback,
    setWidgetValue: (node: FakeNode, name: string, value: unknown) => {
      const w = find(node, name)
      if (w) w.value = value
      return !!w
    },
    isInputConnected: (node: FakeNode, name: string) => node.inputs?.find((i) => i.name === name)?.link != null,
    fitNodeHeight: () => {},
    fetchApi: () => Promise.reject(new Error('no network in tests'))
  }
})

vi.stubGlobal('requestAnimationFrame', (cb: () => void) => cb())

const TPL: Template = {
  id: 'scene',
  name: 'Scene',
  category: '',
  template: '{a}, {b}',
  negative_prompt: '',
  variables: { a: 'x', b: '' }
}

function makeNode(values: Partial<Record<string, unknown>> = {}) {
  const node = {
    widgets: [
      { name: 'template_id', value: values.template_id ?? '' },
      { name: 'variables', value: values.variables ?? '{}' },
      { name: 'snapshot', value: values.snapshot ?? '' },
      { name: 'pin_snapshot', value: values.pin_snapshot ?? false }
    ],
    inputs: [{ name: 'text', link: null as number | null }]
  }
  const widget = (name: string) => node.widgets.find((w) => w.name === name)!
  return { node, widget }
}

function controllerFor(node: unknown) {
  return new PromptTemplateController(node as ConstructorParameters<typeof PromptTemplateController>[0])
}

beforeEach(() => {
  library.templates = [TPL]
})

describe('PromptTemplateController', () => {
  it('reads its initial state from the widgets', () => {
    const { node } = makeNode({ template_id: 'scene', variables: '{"a":"1"}', pin_snapshot: true })
    const c = controllerFor(node)
    expect(c.state).toMatchObject({ templateId: 'scene', variables: { a: '1' }, snapshot: null, pinned: true })
  })

  it('selectTemplate writes id, default variables and a snapshot', () => {
    const { node, widget } = makeNode()
    controllerFor(node).selectTemplate('scene')
    expect(widget('template_id').value).toBe('scene')
    expect(JSON.parse(widget('variables').value as string)).toEqual({ a: 'x', b: '' })
    expect(JSON.parse(widget('snapshot').value as string)).toMatchObject({ id: 'scene', template: '{a}, {b}' })
  })

  it('setVariable and resetVariable update the variables widget', () => {
    const { node, widget } = makeNode()
    const c = controllerFor(node)
    c.selectTemplate('scene')
    c.setVariable('a', 'changed')
    expect(JSON.parse(widget('variables').value as string).a).toBe('changed')
    c.resetVariable('a')
    expect(JSON.parse(widget('variables').value as string).a).toBe('x')
  })

  it('captureSnapshot does not rewrite an unchanged snapshot', () => {
    const { node, widget } = makeNode()
    const c = controllerFor(node)
    c.selectTemplate('scene')
    const first = widget('snapshot').value
    c.captureSnapshot()
    expect(widget('snapshot').value).toBe(first)
  })

  it('captureSnapshot updates the snapshot when the library changed', () => {
    const { node, widget } = makeNode()
    const c = controllerFor(node)
    c.selectTemplate('scene')
    library.templates = [{ ...TPL, template: '{a}, {b}, EDITED' }]
    c.captureSnapshot()
    expect(JSON.parse(widget('snapshot').value as string).template).toBe('{a}, {b}, EDITED')
  })

  it('captureSnapshot re-reads widgets written behind its back', () => {
    // Regression (M2): the snapshot widget was cleared directly, but the reactive
    // mirror still held the old snapshot, so nothing was captured on queue.
    const { node, widget } = makeNode()
    const c = controllerFor(node)
    c.selectTemplate('scene')
    widget('snapshot').value = ''
    c.captureSnapshot()
    expect(JSON.parse(widget('snapshot').value as string).id).toBe('scene')
  })

  it('captureSnapshot does nothing when pinned', () => {
    const { node, widget } = makeNode({ template_id: 'scene', snapshot: '', pin_snapshot: true })
    controllerFor(node).captureSnapshot()
    expect(widget('snapshot').value).toBe('')
  })

  it('captureSnapshot does nothing for a template missing from the library', () => {
    const { node, widget } = makeNode({ template_id: 'gone' })
    controllerFor(node).captureSnapshot()
    expect(widget('snapshot').value).toBe('')
  })

  it('tracks whether the text input is connected', () => {
    const { node } = makeNode()
    const c = controllerFor(node)
    expect(c.state.textConnected).toBe(false)
    node.inputs[0].link = 7
    c.syncConnections()
    expect(c.state.textConnected).toBe(true)
  })
})
