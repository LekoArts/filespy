import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    entry: ['src/index.ts'],
    dts: true,
    sourcemap: !!options.watch,
    format: 'esm',
    minify: !options.watch,
    clean: true,
    outExtension() {
      return {
        js: '.mjs',
      }
    },
  }
})
