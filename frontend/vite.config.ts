/// <reference types="vitest/config" />
import { resolve } from 'node:path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Output: ../web/main.js + ../web/main.css (single chunk).
// ComfyUI loads every **/*.js under WEB_DIRECTORY as an extension, so code
// splitting must stay off (inlineDynamicImports).
//
// `comfy/app` and `comfy/api` are provided by the ComfyUI frontend at runtime.
// main.js is served from /extensions/NF_Suite/main.js, so they resolve to
// /scripts/app.js and /scripts/api.js.
const COMFY_MODULES: Record<string, string> = {
  'comfy/app': '../../scripts/app.js',
  'comfy/api': '../../scripts/api.js'
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  },
  build: {
    outDir: resolve(__dirname, '../web'),
    emptyOutDir: true,
    sourcemap: true,
    minify: true,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      formats: ['es'],
      fileName: () => 'main.js',
      cssFileName: 'main'
    },
    rollupOptions: {
      external: Object.keys(COMFY_MODULES),
      output: {
        paths: COMFY_MODULES,
        inlineDynamicImports: true
      }
    }
  }
})
