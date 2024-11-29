import 'dotenv/config'
import { createMiddleware } from '@tanstack/start'
import { getRequestHeader, setResponseStatus } from 'vinxi/http'

export const $csrfMiddleware = createMiddleware().server(async ({ next }) => {
  const origin = getRequestHeader('Origin')
  if (!origin || !origin.startsWith(process.env.SERVER_URL!)) {
    setResponseStatus(403)
    throw new Error('CSRF protection')
  }
  return await next()
})
