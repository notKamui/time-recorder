import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
  loader: ({ context: { session } }) => {
    if (!session) throw redirect({ to: '/login' })
  },
})
