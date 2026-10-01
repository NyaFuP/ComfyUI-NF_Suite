/**
 * Keeps an editor's unsaved state across unmount/remount.
 * The sidebar tab is destroyed whenever another tab is shown; without this,
 * switching tabs would silently drop unsaved edits.
 */
import type { TemplateForm } from './editorForm'

export interface EditorSession {
  selectedId: string | null
  form: TemplateForm | null
}

const sessions = new Map<string, EditorSession>()

export function loadSession(key: string | undefined): EditorSession | undefined {
  return key ? sessions.get(key) : undefined
}

export function saveSession(key: string | undefined, session: EditorSession): void {
  if (key) sessions.set(key, session)
}
