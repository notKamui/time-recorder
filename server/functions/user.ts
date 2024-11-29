import { db, takeUniqueOrNull } from '@server/db'
import { usersTable } from '@server/db/schema'
import { $sessionMiddleware } from '@server/middlewares/session'
import {
  hashPassword,
  verifyPassword,
  verifyPasswordStrength,
} from '@server/utils/password'
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from '@server/utils/session'
import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { eq } from 'drizzle-orm'
import { z } from 'vinxi'

const SignUpSchema = z
  .object({
    username: z.string().trim().min(3).max(32),
    password: z
      .string()
      .refine(async (value) => await verifyPasswordStrength(value)),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword)

export const $signUp = createServerFn({ method: 'POST' })
  .validator((data: z.infer<typeof SignUpSchema>) => SignUpSchema.parse(data))
  .handler(async ({ data: { username, password } }) => {
    const hashedPassword = await hashPassword(password)
    const user = await db
      .insert(usersTable)
      .values({ username, hashedPassword })
      .returning({ id: usersTable.id, username: usersTable.username })
      .then(takeUniqueOrNull)

    if (!user) throw new Error('Failed to create user')
  })

const SignInSchema = z.object({
  username: z.string().trim().min(3).max(32),
  password: z.string(),
})

export const $signIn = createServerFn({ method: 'POST' })
  .validator((data: z.infer<typeof SignInSchema>) => SignInSchema.parse(data))
  .handler(async ({ data: { username, password } }) => {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1)
      .then(takeUniqueOrNull)

    if (!user) throw new Error('User not found')

    const passwordMatch = await verifyPassword(password, user.hashedPassword)
    if (!passwordMatch) throw new Error('Invalid password')

    const token = generateSessionToken()
    const session = await createSession(token, user.id)
    setSessionTokenCookie(token, session.expiresAt)

    throw redirect({
      to: '/app',
    })
  })

export const $authenticate = createServerFn({ method: 'GET' })
  .middleware([$sessionMiddleware])
  .handler(({ context: { session, user } }) => {
    return {
      session,
      user,
    }
  })
