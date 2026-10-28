/**
 * Fold state for a template list grouped by category (node dropdown and editor list).
 * Starts with only the selected template's category open; nothing is remembered.
 */
import { computed, type Ref, ref } from 'vue'

import { foldGroups, groupOf, type TemplateGroup } from './logic'

export function useFoldedGroups(groups: Ref<TemplateGroup[]>, selectedId: Ref<string | null>) {
  const expanded = ref(new Set<string>())
  const filtering = ref(false)

  const options = computed(() => foldGroups(groups.value, expanded.value, filtering.value))
  const counts = computed(() => new Map(groups.value.map((g) => [g.label, g.items.length])))

  /** Close every group except the one holding the selected template. */
  function reset() {
    const label = groupOf(groups.value, selectedId.value)
    expanded.value = new Set(label ? [label] : [])
    filtering.value = false
  }

  function expand(label: string | undefined) {
    if (label && !expanded.value.has(label)) expanded.value = new Set([...expanded.value, label])
  }

  function toggle(label: string) {
    const next = new Set(expanded.value)
    if (!next.delete(label)) next.add(label)
    expanded.value = next
  }

  /** PrimeVue `filter` event: show every group while there is a search text. */
  function onFilter(event: { value: string }) {
    filtering.value = event.value.trim() !== ''
  }

  const isExpanded = (label: string) => filtering.value || expanded.value.has(label)

  reset()
  return { options, counts, reset, expand, toggle, onFilter, isExpanded }
}
