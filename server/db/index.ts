import { env } from '@common/utils/env'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const postgresClient = postgres(env.DATABASE_URL)
export const db = drizzle({ client: postgresClient })

export function takeUniqueOrNull<T extends any[]>(values: T): T[number] | null {
  return values.length > 0 ? values[0] : null
}
