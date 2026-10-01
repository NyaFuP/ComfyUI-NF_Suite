import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/core/apiClient'

import { createTemplate, deleteTemplate, library, updateTemplate } from './libraryStore'
import type { Template } from './types'

const requestJson = vi.hoisted(() => vi.fn())

vi.mock('@/core/apiClient', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/core/apiClient')>()
  return { ...original, requestJson }
})
vi.mock('@/core/comfy', () => ({ fetchApi: vi.fn() }))

const A: Template = { id: 'a', name: 'A', category: '', template: '', negative_prompt: '', variables: {} }
const B: Template = { ...A, id: 'b', name: 'B' }

beforeEach(() => {
  requestJson.mockReset()
  library.templates = [A, B]
  library.revision = 'rev1'
  library.loaded = true
  library.error = null
})

function lastCall() {
  const [route, init] = requestJson.mock.calls.at(-1)!
  return { route, method: init?.method, body: init?.body ? JSON.parse(init.body) : undefined }
}

describe('createTemplate', () => {
  it('posts with the current revision and appends the result', async () => {
    requestJson.mockResolvedValueOnce({ template: { ...A, id: 'c', name: 'C' }, revision: 'rev2' })
    const created = await createTemplate({ name: 'C', template: '' })
    expect(lastCall()).toEqual({
      route: '/nyafu/prompt_template/templates',
      method: 'POST',
      body: { template: { name: 'C', template: '' }, base_revision: 'rev1' }
    })
    expect(created.id).toBe('c')
    expect(library.templates.map((t) => t.id)).toEqual(['a', 'b', 'c'])
    expect(library.revision).toBe('rev2')
  })
})

describe('updateTemplate', () => {
  it('puts and replaces the template in place', async () => {
    requestJson.mockResolvedValueOnce({ template: { ...A, name: 'A2' }, revision: 'rev2' })
    await updateTemplate('a', { ...A, name: 'A2' })
    expect(lastCall().route).toBe('/nyafu/prompt_template/templates/a')
    expect(lastCall().method).toBe('PUT')
    expect(library.templates.map((t) => t.name)).toEqual(['A2', 'B'])
    expect(library.revision).toBe('rev2')
  })

  it('url-encodes the id', async () => {
    requestJson.mockResolvedValueOnce({ template: A, revision: 'rev2' })
    await updateTemplate('a b', A)
    expect(lastCall().route).toBe('/nyafu/prompt_template/templates/a%20b')
  })
})

describe('deleteTemplate', () => {
  it('deletes with the revision in the query and removes it locally', async () => {
    requestJson.mockResolvedValueOnce({ revision: 'rev2' })
    await deleteTemplate('a')
    expect(lastCall()).toMatchObject({ route: '/nyafu/prompt_template/templates/a?base_revision=rev1', method: 'DELETE' })
    expect(library.templates.map((t) => t.id)).toEqual(['b'])
    expect(library.revision).toBe('rev2')
  })
})

describe('conflicts', () => {
  it('reloads the library and rethrows on 409', async () => {
    requestJson
      .mockRejectedValueOnce(new ApiError(409, { code: 'CONFLICT', message: 'changed' }))
      .mockResolvedValueOnce({ version: 1, revision: 'rev9', templates: [B], warnings: [] })
    await expect(updateTemplate('a', A)).rejects.toMatchObject({ status: 409 })
    expect(library.revision).toBe('rev9')
    expect(library.templates.map((t) => t.id)).toEqual(['b'])
  })

  it('does not change local state on other errors', async () => {
    requestJson.mockRejectedValueOnce(new ApiError(422, { code: 'INVALID_TEMPLATE', message: 'bad' }))
    await expect(createTemplate({ name: '' })).rejects.toMatchObject({ status: 422 })
    expect(library.templates.map((t) => t.id)).toEqual(['a', 'b'])
    expect(library.revision).toBe('rev1')
  })
})
