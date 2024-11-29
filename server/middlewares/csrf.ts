import { createMiddleware } from '@tanstack/start'
import { getRequestURL, setResponseStatus } from 'vinxi/http'

export const $csrfMiddleware = createMiddleware().server(async ({ next }) => {
  const origin = getRequestURL().origin

  if (!origin || !origin.startsWith(process.env.SERVER_URL!)) {
    setResponseStatus(403)
    throw new Error('CSRF protection')
  }
  return await next()
})
