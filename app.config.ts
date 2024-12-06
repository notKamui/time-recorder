import { defineConfig } from '@tanstack/start/config'
import tsconfigPaths from 'vite-tsconfig-paths'

const a = tsconfigPaths()

export default defineConfig({
  server: {
    preset: 'node-server',
  },
  tsr: {
    generatedRouteTree: './app/gen/route-tree.gen.ts',
  },
  vite: {
    plugins: [a],
  },
})
