declare const uuidBrand: unique symbol
export type UUID = `${string}-${string}-${string}-${string}-${string}` & {
  readonly [uuidBrand]: unknown
}

export function generateUUID(): UUID {
  return crypto.randomUUID() as UUID
}
