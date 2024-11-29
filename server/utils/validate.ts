import type { z } from 'vinxi'

export function validate<S extends Zod.Schema>(
  schema: S,
  options?: { async?: false },
): (data: z.infer<S>) => z.infer<S>

export function validate<S extends Zod.Schema>(
  schema: S,
  options?: { async: true },
): (data: z.infer<S>) => Promise<z.infer<S>>

export function validate<S extends Zod.Schema>(
  schema: S,
  options?: { async?: boolean },
) {
  return (data: z.infer<S>) =>
    options?.async ? schema.parseAsync(data) : schema.parse(data)
}
