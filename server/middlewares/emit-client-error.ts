import { createMiddleware } from '@tanstack/start'

export const $emitClientErrorMiddleware = createMiddleware()
  .client(async ({ next }) => {
    try {
      return await next()
    } catch (error) {
      console.log('Client error:', error)

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
