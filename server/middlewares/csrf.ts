import { env } from '@common/utils/env'
import { badRequest } from '@server/utils/response'
import { createMiddleware } from '@tanstack/start'
import { getRequestURL } from 'vinxi/http'

export const $csrfMiddleware = createMiddleware().server(async ({ next }) => {
  const origin = getRequestURL().origin

  if (!origin || !origin.startsWith(env.SERVER_URL)) {
    badRequest('CSRF protection', 403)
  }
  return await next()
})
