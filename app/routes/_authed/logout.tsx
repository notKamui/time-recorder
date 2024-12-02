import { $signOut } from '@server/functions/user'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/logout')({
  loader: async () => {
    await $signOut()
  },
})
