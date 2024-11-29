import { tryAsync, tryInline } from '@common/utils/try'
import { json } from '@tanstack/start'
import { ZodError, type ZodSchema, type z } from 'zod'

export function validate<S extends ZodSchema>(
  schema: S,
  options?: { async?: false },
): (data: z.infer<S>) => z.infer<S>

export function validate<S extends ZodSchema>(
  schema: S,
  options?: { async: true },
): (data: z.infer<S>) => Promise<z.infer<S>>

export function validate<S extends ZodSchema, Data = z.infer<S>>(
  schema: S,
  options?: { async?: boolean },
) {
  return options?.async
    ? async (data: Data) => {
        const [error, result] = await tryAsync<Data, ZodError>(
          schema.parse(data),
          [ZodError],
        )
        respondIfError(error)
        return result
      }
    : (data: Data) => {
        const [error, result] = tryInline<Data, ZodError>(
          () => schema.parse(data),
          [ZodError],
        )
        respondIfError(error)
        return result
      }
}

function respondIfError(error: ZodError | null) {
  if (!error) return
  throw json(
    {
      message: 'Validation error',
      errors: error.errors,
    },
    { status: 400 },
  )
}
