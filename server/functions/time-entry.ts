import { db, takeUniqueOrNull } from '@server/db'
import { timeEntriesTable } from '@server/db/schema'
import { $rateLimitMiddleware } from '@server/middlewares/rate-limit'
import { $sessionMiddleware } from '@server/middlewares/session'
import { validate } from '@server/utils/validate'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { and, eq, gte, isNotNull, lte } from 'drizzle-orm'
import { z } from 'zod'

export const $getTimeEntriesByDay = createServerFn({ method: 'GET' })
  .middleware([$sessionMiddleware])
  .validator(validate(z.object({ date: z.date() })))
  .handler(async ({ context: { user }, data: { date } }) => {
    const dayBegin = new Date(date)
    dayBegin.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    const result = await db
      .select()
      .from(timeEntriesTable)
      .where(
        and(
          eq(timeEntriesTable.userId, user.id),
          gte(timeEntriesTable.startedAt, dayBegin),
          isNotNull(timeEntriesTable.endedAt),
          lte(timeEntriesTable.endedAt, dayEnd),
        ),
      )

    return result
  })

export const $createTimeEntry = createServerFn({ method: 'POST' })
  .middleware([$sessionMiddleware, $rateLimitMiddleware])
  .validator(validate(z.object({ description: z.string() })))
  .handler(async ({ context: { user }, data: { description } }) => {
    const timeEntry = await db
      .insert(timeEntriesTable)
      .values({
        userId: user.id,
        startedAt: new Date(),
        description,
      })
      .returning({ id: timeEntriesTable.id })

    return timeEntry
  })

export const $updateTimeEntry = createServerFn({ method: 'POST' })
  .middleware([$sessionMiddleware, $rateLimitMiddleware])
  .validator(
    validate(
      z.object({
        id: z.string(),
        startedAt: z.date().optional(),
        endedAt: z.date().optional(),
        description: z.string().optional(),
      }),
    ),
  )
  .handler(
    async ({
      context: { user },
      data: { id, startedAt, endedAt, description },
    }) => {
      const timeEntry = await db
        .update(timeEntriesTable)
        .set({ startedAt, endedAt, description })
        .where(
          and(
            eq(timeEntriesTable.id, id),
            eq(timeEntriesTable.userId, user.id),
          ),
        )
        .returning({ id: timeEntriesTable.id })
        .then(takeUniqueOrNull)

      if (!timeEntry) throw notFound()

      return timeEntry
    },
  )

export const $deleteTimeEntry = createServerFn({ method: 'POST' })
  .middleware([$sessionMiddleware, $rateLimitMiddleware])
  .validator(validate(z.object({ id: z.string() })))
  .handler(async ({ context: { user }, data: { id } }) => {
    const timeEntry = await db
      .delete(timeEntriesTable)
      .where(
        and(eq(timeEntriesTable.id, id), eq(timeEntriesTable.userId, user.id)),
      )
      .returning({ id: timeEntriesTable.id })
      .then(takeUniqueOrNull)

    if (!timeEntry) throw notFound()

    return timeEntry
  })
