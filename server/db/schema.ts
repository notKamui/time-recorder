import type { UUID } from '@common/utils/uuid'
import type { InferSelectModel } from 'drizzle-orm'
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom().$type<UUID>(),
  username: varchar({ length: 255 }).unique().notNull(),
  hashedPassword: varchar({ length: 255 }).notNull(),
})
export type User = InferSelectModel<typeof usersTable>

export const sessionsTable = pgTable('sessions', {
  id: uuid().primaryKey().defaultRandom().$type<UUID>(),
  userId: uuid()
    .notNull()
    .references(() => usersTable.id)
    .$type<UUID>(),
  expiresAt: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
})
export type Session = InferSelectModel<typeof sessionsTable>
