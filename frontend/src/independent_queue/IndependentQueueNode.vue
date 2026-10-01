<script setup lang="ts">
import Button from 'primevue/button'
import { computed, onBeforeUnmount } from 'vue'

import { toast } from '@/core/comfy'

import type { IndependentQueueRunner } from './runner'

const props = defineProps<{ runner: IndependentQueueRunner }>()
const runner = props.runner

const state = computed(() => runner.job.value?.state ?? null)
const result = computed(() => runner.resultText())

const statusText = computed(() => {
  if (runner.starting.value) return 'Queueing…'
  const s = state.value
  if (!s) return null
  switch (s.status) {
    case 'queued':
      return 'Waiting in queue…'
    case 'running': {
      const title = runner.runningTitle()
      return `Running${title ? `: ${title}` : '…'} (${s.nodesDone}/${s.nodesTotal})`
    }
    case 'success':
      return `Done (${s.nodesDone}/${s.nodesTotal})`
    case 'interrupted':
      return 'Interrupted'
    case 'cancelled':
      return 'Cancelled'
    case 'error':
      return null
  }
  return null
})

const statusLevel = computed(() => (state.value?.status === 'success' ? 'info' : 'muted'))

const errorText = computed(() => {
  if (runner.queueError.value) return runner.queueError.value
  const error = state.value?.status === 'error' ? state.value.error : null
  if (!error) return null
  return error.nodeType ? `${error.nodeType}: ${error.message}` : error.message
})

const progressPercent = computed(() => {
  const p = state.value?.progress
  if (!p || p.max <= 1) return null
  return Math.round((p.value / p.max) * 100)
})

const seedNote = computed(() => {
  const changes = runner.seedChanges.value
  if (!changes.length) return null
  return changes.map((c) => `#${c.nodeId} ${c.widget} → ${c.to}`).join(', ')
})

async function copyResult() {
  if (!result.value) return
  try {
    await navigator.clipboard.writeText(result.value)
    toast('success', 'Copied')
  } catch (e) {
    toast('error', 'Copy failed', e instanceof Error ? e.message : String(e))
  }
}

onBeforeUnmount(() => runner.dispose())
</script>

<template>
  <div class="nf-root nf-iq">
    <div class="nf-row">
      <Button
        v-if="!runner.busy"
        class="nf-button nf-button-primary nf-grow"
        icon="pi pi-play"
        label="Run"
        title="Run only the upstream branch of this node"
        @click="runner.run()"
      />
      <Button
        v-else
        class="nf-button nf-button-danger nf-grow"
        icon="pi pi-stop"
        label="Cancel"
        :disabled="runner.starting.value"
        @click="runner.cancel()"
      />
    </div>

    <div v-if="statusText" class="nf-notice" :data-level="statusLevel">{{ statusText }}</div>
    <div v-if="progressPercent !== null" class="nf-progress" role="progressbar" :aria-valuenow="progressPercent">
      <div class="nf-progress-bar" :style="{ width: `${progressPercent}%` }" />
    </div>
    <div v-if="errorText" class="nf-notice nf-pre" data-level="error">{{ errorText }}</div>
    <div v-if="seedNote && state?.status !== 'error'" class="nf-muted nf-small">seed: {{ seedNote }}</div>

    <div v-if="result !== null" class="nf-preview">
      <div class="nf-row">
        <span class="nf-preview-label nf-grow">result</span>
        <Button class="nf-icon-button" icon="pi pi-copy" title="Copy" @click="copyResult" />
      </div>
      <pre class="nf-preview-text nf-iq-result">{{ result || ' ' }}</pre>
    </div>
  </div>
</template>
