import { defineConfig } from '@tanstack/start/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    preset: 'node-server',
  },
  tsr: {
    generatedRouteTree: './app/gen/route-tree.gen.ts',
  },
  vite: {
    plugins: [
      tsconfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
})
