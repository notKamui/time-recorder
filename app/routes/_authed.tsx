import { $authenticate } from '@server/functions/user'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
  beforeLoad: async () => {
    const { session, user } = await $authenticate()
    return { session, user }
  },
})
