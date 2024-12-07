import { env } from '@common/utils/env'
import { badRequest } from '@server/utils/response'
import { createMiddleware } from '@tanstack/start'
import { getRequestURL, isMethod } from 'vinxi/http'

export const $$csrf = createMiddleware().server(async ({ next }) => {
  if (env.DISABLE_CSRF) return await next()
  if (!isMethod(['POST', 'PUT', 'PATCH', 'DELETE'])) {
    return await next()
  }

  const origin = getRequestURL().origin

  if (!origin || !origin.startsWith(env.SERVER_URL)) {
    badRequest('CSRF protection', 403)
  }
  return await next()
})
