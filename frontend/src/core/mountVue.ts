import PrimeVue from 'primevue/config'
import { type Component, type ComponentPublicInstance, createApp } from 'vue'

import { primeVuePassThrough } from './primevuePt'

export interface MountedVue {
  /** The root component instance (its defineExpose members are available). */
  instance: ComponentPublicInstance
  unmount: () => void
}

/**
 * Mount a component with our own bundled Vue + PrimeVue (unstyled mode).
 * The ComfyUI frontend does not expose its Vue/PrimeVue, and styled PrimeVue would
 * inject theme <style> tags that can collide with the host's, so we run unstyled and
 * style components ourselves (see styles.css).
 */
export function mountVue(
  element: HTMLElement,
  component: Component,
  props: Record<string, unknown> = {}
): MountedVue {
  const vueApp = createApp(component, props)
  vueApp.use(PrimeVue, { unstyled: true, pt: primeVuePassThrough })
  const instance = vueApp.mount(element)
  return { instance, unmount: () => vueApp.unmount() }
}
