import { DefaultCatchBoundary } from '@/components/default-catch-boundary'
import { NotFound } from '@/components/not-found'
import { routeTree } from '@/gen/route-tree.gen'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}