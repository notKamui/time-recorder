import { $$csrf } from '@server/middlewares/csrf'
import { $$emitErrors } from '@server/middlewares/emit-errors'
import { registerGlobalMiddleware } from '@tanstack/start'

registerGlobalMiddleware({
  middleware: [$$emitErrors, $$csrf],
})
