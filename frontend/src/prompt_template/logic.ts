/**
 * Pure helpers (no Vue, no ComfyUI).
 * resolveTemplate mirrors nodes/prompt_template/resolve.py so the preview shows
 * what the backend will execute. Expansion itself is done by the backend (/expand).
 */
import type { Snapshot, Template } from './types'

export function parseVariables(raw: unknown): Record<string, string> {
  if (typeof raw !== 'string' || !raw.trim()) return {}
  try {
    const data = JSON.parse(raw)
    if (data === null || typeof data !== 'object' || Array.isArray(data)) return {}
    return Object.fromEntries(Object.entries(data).filter(([, v]) => typeof v === 'string')) as Record<
      string,
      string
    >
  } catch {
    return {}
  }
}

export function parseSnapshot(raw: unknown): Snapshot | null {
  if (typeof raw !== 'string' || !raw.trim()) return null
  try {
    const data = JSON.parse(raw)
    if (data && typeof data === 'object' && typeof data.id === 'string' && typeof data.template === 'string') {
      return { category: '', negative_prompt: '', variables: {}, ...data } as Snapshot
    }
  } catch {
    // invalid snapshot is treated as absent; the backend reports it on queue
  }
  return null
}

function contentKey(t: Template): string {
  const variables = Object.fromEntries(Object.entries(t.variables ?? {}).sort(([a], [b]) => a.localeCompare(b)))
  return JSON.stringify([t.template, t.negative_prompt ?? '', variables])
}

/** True when both produce the same output (name/category/metadata ignored). */
export function sameContent(a: Template, b: Template): boolean {
  return contentKey(a) === contentKey(b)
}

export function buildSnapshot(template: Template, now: Date = new Date()): string {
  const snapshot: Snapshot = { ...template, captured_at: now.toISOString() }
  return JSON.stringify(snapshot)
}

export interface TemplateGroup {
  label: string
  items: { id: string; name: string }[]
}

const UNCATEGORIZED = 'Uncategorized'

/** Group by category (first-seen order); templates without a category go last. */
export function groupTemplates(templates: Template[]): TemplateGroup[] {
  const groups = new Map<string, TemplateGroup['items']>()
  for (const t of templates) {
    const key = t.category || ''
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push({ id: t.id, name: t.name })
  }
  const result = [...groups].filter(([key]) => key).map(([label, items]) => ({ label, items }))
  const uncategorized = groups.get('')
  if (uncategorized) result.push({ label: UNCATEGORIZED, items: uncategorized })
  return result
}

export type ResolveNotice =
  | 'none'
  | 'pinned'
  | 'pinned_without_snapshot'
  | 'snapshot_outdated'
  | 'template_missing'
  | 'not_found'
  | 'no_template'

export interface Resolved {
  template: Template | null
  source: 'library' | 'snapshot' | null
  notice: ResolveNotice
}

export function resolveTemplate(
  templateId: string,
  libraryTemplate: Template | undefined,
  snapshot: Snapshot | null,
  pinned: boolean
): Resolved {
  if (pinned) {
    return snapshot
      ? { template: snapshot, source: 'snapshot', notice: 'pinned' }
      : { template: null, source: null, notice: 'pinned_without_snapshot' }
  }
  if (!templateId) return { template: null, source: null, notice: 'no_template' }
  if (libraryTemplate) {
    const outdated = snapshot !== null && !sameContent(snapshot, libraryTemplate)
    return { template: libraryTemplate, source: 'library', notice: outdated ? 'snapshot_outdated' : 'none' }
  }
  if (snapshot && snapshot.id === templateId) {
    return { template: snapshot, source: 'snapshot', notice: 'template_missing' }
  }
  return { template: null, source: null, notice: 'not_found' }
}
