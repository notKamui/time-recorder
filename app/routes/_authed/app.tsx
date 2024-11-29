import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/app')({
  loader: ({ context: { user } }) => {
    return { user }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useLoaderData()
  return (
    <div>
      Hello "/_authed/app"!
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}
