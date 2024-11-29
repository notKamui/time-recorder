import type { UUID } from '@common/utils/uuid'
import { sha256 } from '@oslojs/crypto/sha2'
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from '@oslojs/encoding'
import { db, takeUniqueOrNull } from '@server/db'
import {
  type Session,
  type User,
  sessionsTable,
  usersTable,
} from '@server/db/schema'
import { eq } from 'drizzle-orm'
import { deleteCookie, getCookie, setCookie } from 'vinxi/http'

const HOUR = 1000 * 60 * 60
const DAY = HOUR * 24

const SESSION_DURATION = DAY * 30
const SESSION_REFRESH_THRESHOLD = DAY * 15

export type SessionValidationResult =
  | { session: Session; user: Omit<User, 'hashedPassword'> }
  | { session: null; user: null }

export function generateSessionToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return encodeBase32LowerCaseNoPadding(bytes)
}

export async function createSession(
  token: string,
  userId: UUID,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(
    sha256(new TextEncoder().encode(token)),
  ) as UUID
  const session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + SESSION_DURATION),
  } as const satisfies Session
  await db.insert(sessionsTable).values(session)
  return session
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(
    sha256(new TextEncoder().encode(token)),
  ) as UUID

  const result = await db
    .select({
      user: { id: usersTable.id, username: usersTable.username },
      session: sessionsTable,
    })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
    .where(eq(sessionsTable.id, sessionId))
    .limit(1)
    .then(takeUniqueOrNull)
  if (!result) return { session: null, user: null }

  const { session, user } = result

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionsTable).where(eq(sessionsTable.id, session.id))
    return { session: null, user: null }
  }

  if (Date.now() >= session.expiresAt.getTime() - SESSION_REFRESH_THRESHOLD) {
    session.expiresAt = new Date(Date.now() + SESSION_DURATION)
    await db
      .update(sessionsTable)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessionsTable.id, session.id))
  }

  return { session, user }
}

export async function invalidateSession(sessionId: UUID): Promise<void> {
  await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId))
}

const SESSION_COOKIE_NAME = 'session'

export function getSessionTokenCookie(): string | null {
  return getCookie(SESSION_COOKIE_NAME) ?? null
}

export function setSessionTokenCookie(token: string, expiresAt: Date) {
  setCookie(SESSION_COOKIE_NAME, token, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    expires: expiresAt,
  })
}

export function deleteSessionTokenCookie() {
  deleteCookie(SESSION_COOKIE_NAME)
}
