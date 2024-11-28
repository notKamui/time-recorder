import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'

export const db = drizzle(process.env.DATABASE_URL!)

export function takeUniqueOrNull<T extends any[]>(values: T): T[number] | null {
  return values.length > 0 ? values[0] : null
}
