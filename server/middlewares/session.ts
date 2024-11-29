import { $csrfMiddleware } from '@server/middlewares/csrf'
import {
  deleteSessionTokenCookie,
  getSessionTokenCookie,
  setSessionTokenCookie,
  validateSessionToken,
} from '@server/utils/session'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/start'
import 'dotenv/config'
import { setResponseStatus } from 'vinxi/http'

export const $sessionMiddleware = createMiddleware()
  .middleware([$csrfMiddleware])
  .server(async ({ next }) => {
    const token = getSessionTokenCookie()
    if (!token) {
      setResponseStatus(401)
      throw redirect({
        to: '/login',
      })
    }

    const { session, user } = await validateSessionToken(token)
    if (!session) {
      deleteSessionTokenCookie()
      setResponseStatus(401)
      throw redirect({
        to: '/login',
      })
    }

    setSessionTokenCookie(token, session.expiresAt)
    return await next({ context: { session, user } })
  })
