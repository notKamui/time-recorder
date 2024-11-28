import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar({ length: 255 }).unique().notNull(),
  googleId: varchar({ length: 255 }).unique().notNull(),
})
