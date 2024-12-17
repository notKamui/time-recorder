import { createTokenBucketManager } from '@server/utils/rate-limit'
import { badRequest } from '@server/utils/response'
import { createMiddleware } from '@tanstack/start'
import { getRequestIP } from 'vinxi/http'

const bucket = createTokenBucketManager<string>(10, 2)

export const $$rateLimit = createMiddleware().server(async ({ next }) => {
  const ip = getRequestIP()
  if (!ip) badRequest('Suspicious request without IP address', 400)
  if (!bucket.consume(ip, 1)) badRequest('Too many requests', 429)
  return await next()
})
