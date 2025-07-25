import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/coordinate-visualizer.ts',
      name: 'CoordinateVisualizer',
      fileName: 'coordinate-visualizer',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    target: 'es2020',
    minify: 'esbuild'
  },
  esbuild: {
    target: 'es2020'
  },
  server: {
    port: 3000,
    open: true
  }
})