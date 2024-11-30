import type { UUID } from '@common/utils/uuid'
import { db, takeUniqueOrNull } from '@server/db'
import { usersTable } from '@server/db/schema'
import { $sessionMiddleware } from '@server/middlewares/session'
import {
  hashPassword,
  verifyPassword,
  verifyPasswordStrength,
} from '@server/utils/password'
import { badRequest } from '@server/utils/response'
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from '@server/utils/session'
import { validate } from '@server/utils/validate'
import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { eq } from 'drizzle-orm'
import { z } from 'vinxi'

const SignUpSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, { message: 'Username must contain at least 3 characters' })
      .max(32, { message: 'Username must contain at most 32 characters' }),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(async (data) => await verifyPasswordStrength(data.password), {
    message: 'Password is too weak',
    path: ['password'],
  })

export const $signUp = createServerFn({ method: 'POST' })
  .validator(validate(SignUpSchema, { async: true }))
  .handler(async ({ data }) => {
    const { username, password } = await data
    const hashedPassword = await hashPassword(password)
    const user = await db
      .insert(usersTable)
      .values({ username, hashedPassword })
      .returning({ id: usersTable.id, username: usersTable.username })
      .then(takeUniqueOrNull)

    if (!user) badRequest('User already exists', 400)

    await loginUser(user.id)
  })

const SignInSchema = z.object({
  username: z.string().trim().min(3).max(32),
  password: z.string(),
})

export const $signIn = createServerFn({ method: 'POST' })
  .validator(validate(SignInSchema))
  .handler(async ({ data: { username, password } }) => {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1)
      .then(takeUniqueOrNull)

    if (!user) return await invalidCredentials()

    const passwordMatch = await verifyPassword(password, user.hashedPassword)
    if (!passwordMatch) return await invalidCredentials()

    await loginUser(user.id)
  })

export const $authenticate = createServerFn({ method: 'GET' })
  .middleware([$sessionMiddleware])
  .handler(({ context: { session, user } }) => {
    return {
      session,
      user,
    }
  })

async function loginUser(userId: UUID) {
  const token = generateSessionToken()
  const session = await createSession(token, userId)
  setSessionTokenCookie(token, session.expiresAt)

  throw redirect({
    to: '/app',
    statusCode: 200,
  })
}

async function invalidCredentials(): Promise<never> {
  await Bun.sleep(1000)
  badRequest('Invalid credentials', 401)
}