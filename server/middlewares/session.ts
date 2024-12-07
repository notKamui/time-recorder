import {
  deleteSessionTokenCookie,
  getSessionTokenCookie,
  setSessionTokenCookie,
  validateSessionToken,
} from '@server/utils/session'
import { redirect } from '@tanstack/react-router'
import { createMiddleware, json } from '@tanstack/start'

export const $$session = createMiddleware().server(async ({ next }) => {
  const token = getSessionTokenCookie()
  if (!token) {
    throw redirect({
      to: '/login',
      statusCode: 401,
    })
  }

  const { session, user } = await validateSessionToken(token)
  if (!session) {
    deleteSessionTokenCookie()
    throw json({ error: 'Invalid session token' }, { status: 401 })
  }

  setSessionTokenCookie(token, session.expiresAt)
  return await next({ context: { session, user } })
})
