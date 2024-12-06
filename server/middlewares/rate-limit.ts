import { badRequest } from '@server/utils/response'
import { createMiddleware } from '@tanstack/start'
import { getRequestIP } from 'vinxi/http'

interface TokenBucket {
  count: number
  refilledAt: number
}

function createTokenBucketManager<Key>(max: number, refillRateSeconds: number) {
  const storage = new Map<Key, TokenBucket>()

  function consume(key: Key, cost: number): boolean {
    let bucket = storage.get(key) ?? null
    const now = Date.now()
    if (!bucket) {
      bucket = { count: max - cost, refilledAt: now }
      storage.set(key, bucket)
      return true
    }
    const refill = Math.floor(
      (now - bucket.refilledAt) / (refillRateSeconds * 1000),
    )
    bucket.count = Math.min(max, bucket.count + refill)
    bucket.refilledAt = now
    if (bucket.count < cost) return false
    bucket.count -= cost
    storage.set(key, bucket)
    return true
  }

  return { max, refillRateSeconds, consume } as const
}

const bucket = createTokenBucketManager<string>(10, 2)

export const $$rateLimit = createMiddleware().server(async ({ next }) => {
  const ip = getRequestIP()
  if (!ip) badRequest('Suspicious request without IP address', 400)
  if (!bucket.consume(ip, 1)) badRequest('Too many requests', 429)
  return await next()
})
