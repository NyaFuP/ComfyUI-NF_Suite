<script setup lang="ts">
import Button from 'primevue/button'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { imageUrl } from '@/core/comfy'

import type { PreviewSelectorController } from './controller'
import { computeGridLayout, type GridLayout } from './gridLayout'

const props = defineProps<{ controller: PreviewSelectorController }>()
const ctl = props.controller
const state = ctl.state

const GAP = 4

// --- layout: the area size comes from the node; the grid never changes the node size ---

const area = ref<HTMLElement>()
const areaSize = ref({ width: 0, height: 0 })
const aspect = ref(1)
let previousCols: number | undefined
let observer: ResizeObserver | undefined

const layout = computed<GridLayout | null>(() => {
  const result = computeGridLayout({
    count: state.candidates.length,
    aspect: aspect.value,
    width: areaSize.value.width,
    height: areaSize.value.height,
    gap: GAP,
    previousCols
  })
  previousCols = result?.cols
  return result
})

const gridStyle = computed(() => {
  const l = layout.value
  if (!l) return {}
  return {
    gridTemplateColumns: `repeat(${l.cols}, ${l.cellW}px)`,
    gridTemplateRows: `repeat(${l.rows}, ${l.cellH}px)`,
    gap: `${GAP}px`
  }
})

onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    areaSize.value = { width: Math.floor(entry.contentRect.width), height: Math.floor(entry.contentRect.height) }
  })
  if (area.value) observer.observe(area.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  ctl.dispose()
})

// New batch: forget the previous column choice and measure the new images.
watch(
  () => state.batchId,
  () => {
    previousCols = undefined
    aspect.value = 1
  }
)

const urls = computed(() => state.candidates.map((c) => imageUrl(c)))

function onImageLoad(event: Event, index: number) {
  const img = event.target as HTMLImageElement
  if (index === 0 && img.naturalWidth && img.naturalHeight) aspect.value = img.naturalWidth / img.naturalHeight
}

// --- status -----------------------------------------------------------------------------

const job = computed(() => ctl.job.value?.state ?? null)

const status = computed(() => {
  if (ctl.queueError.value) return { level: 'error', text: ctl.queueError.value }
  const s = job.value
  const verb = ctl.action.value === 'continue' ? 'Continue' : 'Generate'
  if (ctl.starting.value) return { level: 'muted', text: `${verb}: queueing…` }
  if (s) {
    if (s.status === 'queued') return { level: 'muted', text: `${verb}: waiting in queue…` }
    if (s.status === 'running') return { level: 'muted', text: `${verb}: running (${s.nodesDone}/${s.nodesTotal})` }
    if (s.status === 'error') return { level: 'error', text: `${verb} failed: ${s.error?.nodeType ? `${s.error.nodeType}: ` : ''}${s.error?.message}` }
    if (s.status === 'interrupted') return { level: 'warn', text: `${verb} interrupted` }
    if (s.status === 'cancelled') return { level: 'muted', text: `${verb} cancelled` }
  }
  if (state.expired) return { level: 'warn', text: 'Candidates are no longer available (ComfyUI restarted). Generate again.' }
  if (!state.candidates.length) return { level: 'muted', text: 'Run the workflow or press Generate to get candidates.' }
  if (s?.status === 'success' && ctl.action.value === 'continue') {
    return { level: 'info', text: `${state.selection.length} / ${state.candidates.length} selected · continued` }
  }
  return { level: 'muted', text: `${state.selection.length} / ${state.candidates.length} selected` }
})

const progressPercent = computed(() => {
  const p = job.value?.status === 'running' ? job.value.progress : null
  return p && p.max > 1 ? Math.round((p.value / p.max) * 100) : null
})
</script>

<template>
  <div class="nf-root nf-ps">
    <div ref="area" class="nf-ps-area">
      <div v-if="state.candidates.length" class="nf-ps-grid" :style="gridStyle">
        <!-- A div (not <button>): some browsers target the button instead of the <img> on
             right-click, which hides "Copy image" / "Save image as" from the native menu. -->
        <div
          v-for="(url, i) in urls"
          :key="`${state.batchId}-${i}`"
          role="button"
          tabindex="0"
          class="nf-ps-cell"
          :class="{ selected: state.selection.includes(i) }"
          :title="`#${i + 1}`"
          :aria-label="`Image ${i + 1}`"
          :aria-pressed="state.selection.includes(i)"
          :aria-disabled="ctl.busy"
          @click="ctl.toggle(i)"
          @keydown.enter.prevent="ctl.toggle(i)"
          @keydown.space.prevent="ctl.toggle(i)"
        >
          <!-- Right-click on the image opens the browser's own menu (copy / save / open image):
               stop the event so ComfyUI does not open its node menu instead. -->
          <img
            :src="url"
            :alt="`Candidate ${i + 1}`"
            draggable="false"
            @dragstart.prevent
            @contextmenu.stop
            @load="onImageLoad($event, i)"
            @error="ctl.markExpired()"
          />
          <span class="nf-ps-badge">{{ i + 1 }}</span>
        </div>
      </div>
    </div>

    <div v-if="progressPercent !== null" class="nf-progress">
      <div class="nf-progress-bar" :style="{ width: `${progressPercent}%` }" />
    </div>

    <div class="nf-ps-bar">
      <span class="nf-ps-status" :data-level="status.level" :title="status.text">{{ status.text }}</span>
      <Button
        class="nf-icon-button"
        icon="pi pi-check-square"
        title="Select all"
        :disabled="ctl.busy || !state.candidates.length"
        @click="ctl.selectAll()"
      />
      <Button
        class="nf-icon-button"
        icon="pi pi-stop"
        title="Clear selection"
        :disabled="ctl.busy || !state.selection.length"
        @click="ctl.clearSelection()"
      />
      <template v-if="!ctl.busy">
        <Button class="nf-button" icon="pi pi-refresh" label="Generate" title="Run the upstream part again" @click="ctl.generate()" />
        <Button
          class="nf-button nf-button-primary"
          icon="pi pi-play"
          label="Continue"
          title="Run the downstream part with the selected images"
          :disabled="!ctl.canContinue"
          @click="ctl.continue()"
        />
      </template>
      <Button v-else class="nf-button nf-button-danger" icon="pi pi-times" label="Cancel" :disabled="ctl.starting.value" @click="ctl.cancel()" />
    </div>
  </div>
</template>
