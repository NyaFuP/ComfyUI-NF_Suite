/**
 * Template library cache shared by every node, the modal and the sidebar.
 * All our Vue apps share this bundled Vue instance, so a module-level reactive() is shared too.
 */
import { reactive } from 'vue'

import { ApiError, requestJson } from '@/core/apiClient'

import { API_PREFIX, type LibraryResponse, type Template } from './types'

interface LibraryState {
  templates: Template[]
  revision: string
  loaded: boolean
  loading: boolean
  error: ApiError | null
}

export const library = reactive<LibraryState>({
  templates: [],
  revision: '',
  loaded: false,
  loading: false,
  error: null
})

let pending: Promise<void> | null = null

/** (Re)load from the server. Concurrent calls share one request. Keeps old data on error. */
export function loadLibrary(): Promise<void> {
  if (pending) return pending
  library.loading = true
  pending = requestJson<LibraryResponse>(`${API_PREFIX}/templates`)
    .then((data) => {
      library.templates = data.templates
      library.revision = data.revision
      library.error = null
      library.loaded = true
    })
    .catch((e: unknown) => {
      library.error = e instanceof ApiError ? e : new ApiError(0, { code: 'UNKNOWN', message: String(e) })
    })
    .finally(() => {
      library.loading = false
      pending = null
    })
  return pending
}

export function ensureLibraryLoaded(): Promise<void> {
  return library.loaded ? Promise.resolve() : loadLibrary()
}

export function findTemplate(id: string): Template | undefined {
  return library.templates.find((t) => t.id === id)
}

// --- writes ---------------------------------------------------------------
// Every write sends the revision it is based on. On 409 the library is reloaded
// (so a retry uses the new revision) and the error is rethrown for the UI.

interface WriteResponse {
  template: Template
  revision: string
}

const templateUrl = (id: string) => `${API_PREFIX}/templates/${encodeURIComponent(id)}`

async function write<T extends { revision: string }>(request: () => Promise<T>): Promise<T> {
  try {
    const result = await request()
    library.revision = result.revision
    return result
  } catch (e) {
    if (e instanceof ApiError && e.status === 409) await loadLibrary()
    throw e
  }
}

export async function createTemplate(template: Partial<Template>): Promise<Template> {
  const result = await write(() =>
    requestJson<WriteResponse>(`${API_PREFIX}/templates`, {
      method: 'POST',
      body: JSON.stringify({ template, base_revision: library.revision })
    })
  )
  library.templates = [...library.templates, result.template]
  return result.template
}

export async function updateTemplate(id: string, template: Partial<Template>): Promise<Template> {
  const result = await write(() =>
    requestJson<WriteResponse>(templateUrl(id), {
      method: 'PUT',
      body: JSON.stringify({ template, base_revision: library.revision })
    })
  )
  library.templates = library.templates.map((t) => (t.id === id ? result.template : t))
  return result.template
}

export async function deleteTemplate(id: string): Promise<void> {
  await write(() =>
    requestJson<{ revision: string }>(
      `${templateUrl(id)}?base_revision=${encodeURIComponent(library.revision)}`,
      { method: 'DELETE' }
    )
  )
  library.templates = library.templates.filter((t) => t.id !== id)
}
