// Modules provided by the ComfyUI frontend at runtime (see vite.config.ts).
declare module 'comfy/app' {
  import type { ComfyApp } from '@comfyorg/comfyui-frontend-types'
  export const app: ComfyApp
}

declare module 'comfy/api' {
  import type { ComfyApi } from '@comfyorg/comfyui-frontend-types'
  export const api: ComfyApi
}
