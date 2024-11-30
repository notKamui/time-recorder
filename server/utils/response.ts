import type { Range } from '@common/utils/types'
import { json } from '@tanstack/start'

export function badRequest(
  message: any,
  status: Range<400, 499>,
  data?: any,
): never {
  throw json({ error: message, data }, { status })
}

export function serverError(
  message: any,
  status: Range<500, 599>,
  data?: any,
): never {
  throw json({ error: message, data }, { status })
}