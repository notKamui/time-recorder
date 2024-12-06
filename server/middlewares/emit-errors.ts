import { createMiddleware } from '@tanstack/start'

export const $$emitErrors = createMiddleware()
  .client(async ({ next }) => {
    try {
      return await next()
    } catch (error) {
      if (typeof error?.message === 'string') {
        const actualError = JSON.parse(error.message)
        window.dispatchEvent(
          new CustomEvent('server-error', { detail: actualError }),
        )
      }
      throw error
    }
  })
  .server(async ({ next }) => await next())
