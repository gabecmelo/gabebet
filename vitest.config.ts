import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '@': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
  test: {
    include: ['test/unit/**/*.{test,spec}.ts'],
    environment: 'node',
    globals: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['app/**/*.ts'],
      exclude: ['node_modules', '.nuxt'],
    },
  },
})
