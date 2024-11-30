import { $csrfMiddleware } from '@server/middlewares/csrf'
import {
  deleteSessionTokenCookie,
  getSessionTokenCookie,
  setSessionTokenCookie,
  validateSessionToken,
} from '@server/utils/session'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/start'

export const $sessionMiddleware = createMiddleware()
  .middleware([$csrfMiddleware])
  .server(async ({ next }) => {
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
      throw redirect({
        to: '/login',
        statusCode: 401,
      })
    }

    setSessionTokenCookie(token, session.expiresAt)
    return await next({ context: { session, user } })
  })
