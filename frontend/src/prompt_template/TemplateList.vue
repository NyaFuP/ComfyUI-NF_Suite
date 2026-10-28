<script setup lang="ts">
/**
 * Editor's template list: search field + categories that fold.
 * Hand-made because PrimeVue's Listbox drops option groups without items, so a folded
 * category would lose its header too.
 */
import InputText from 'primevue/inputtext'
import { computed, ref, toRef, watch } from 'vue'

import { useFoldedGroups } from './foldedGroups'
import GroupToggle from './GroupToggle.vue'
import { filterGroups, groupOf, type TemplateGroup } from './logic'

const props = defineProps<{ groups: TemplateGroup[]; selectedId: string | null }>()
const emit = defineEmits<{ select: [id: string] }>()

const search = ref('')
const matches = computed(() => filterGroups(props.groups, search.value))
const folded = useFoldedGroups(matches, toRef(props, 'selectedId'))

watch(search, (value) => folded.onFilter({ value }))
// Open the selected template's category whenever it changes (first load, selection, a save
// that moved it); the others stay as the user left them.
watch([() => props.selectedId, () => props.groups], () => folded.expand(groupOf(props.groups, props.selectedId)), {
  immediate: true
})
</script>

<template>
  <div class="nf-listbox">
    <div class="nf-listbox-header">
      <InputText v-model="search" placeholder="Search" aria-label="Search templates" />
    </div>
    <div class="nf-listbox-list-container">
      <ul v-if="folded.options.value.length" class="nf-overlay-list" role="listbox">
        <template v-for="group in folded.options.value" :key="group.label">
          <li class="nf-overlay-group" role="presentation">
            <GroupToggle
              :label="group.label"
              :count="folded.counts.value.get(group.label) ?? 0"
              :expanded="folded.isExpanded(group.label)"
              @toggle="folded.toggle(group.label)"
            />
          </li>
          <li
            v-for="item in group.items"
            :key="item.id"
            class="nf-overlay-option"
            role="option"
            :aria-selected="item.id === selectedId"
            :data-p-selected="item.id === selectedId"
            :title="item.name"
            @click="emit('select', item.id)"
          >
            {{ item.name }}
          </li>
        </template>
      </ul>
      <div v-else class="nf-overlay-empty">{{ search.trim() ? 'No matches' : 'No templates' }}</div>
    </div>
  </div>
</template>
