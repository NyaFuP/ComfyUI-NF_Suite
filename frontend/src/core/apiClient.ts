import { fetchApi } from './comfy'

export interface ApiErrorBody {
  code: string
  message: string
  details?: unknown
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(status: number, body: ApiErrorBody) {
    super(body.message)
    this.status = status
    this.code = body.code
    this.details = body.details
  }
}

/** JSON request to our backend. Throws ApiError for non-2xx responses. */
export async function requestJson<T>(route: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body !== undefined && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  let response: Response
  try {
    response = await fetchApi(route, { ...init, headers })
  } catch (e) {
    throw new ApiError(0, { code: 'NETWORK_ERROR', message: e instanceof Error ? e.message : String(e) })
  }

  let body: unknown = null
  try {
    body = await response.json()
  } catch {
    // non-JSON body (e.g. proxy error page)
  }

  if (!response.ok) {
    const error = (body as { error?: ApiErrorBody } | null)?.error
    throw new ApiError(response.status, error ?? { code: 'HTTP_ERROR', message: `HTTP ${response.status}` })
  }
  return body as T
}
