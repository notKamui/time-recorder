import { db, takeUniqueOrNull } from '@/db'
import { usersTable } from '@/db/schema'
import { google } from '@/utils/google'
import { redirect } from '@tanstack/react-router'
import { createAPIFileRoute } from '@tanstack/start/api'
import { type OAuth2Tokens, decodeIdToken } from 'arctic'
import { eq } from 'drizzle-orm'
import { getCookie, getRequestURL, setResponseStatus } from 'vinxi/server'

export const APIRoute = createAPIFileRoute('/api/login/google/callback')({
  GET: async () => {
    const url = getRequestURL()
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')

    const storedState = getCookie('google_oauth_state') ?? null
    const codeVerifier = getCookie('google_code_verifier') ?? null

    if (
      !code ||
      !state ||
      !storedState ||
      !codeVerifier ||
      state !== storedState
    ) {
      setResponseStatus(400)
      return new Response()
    }

    let tokens: OAuth2Tokens
    try {
      tokens = await google.validateAuthorizationCode(code, codeVerifier)
    } catch {
      setResponseStatus(400)
      return new Response()
    }

    const { sub: googleId, name: username } = decodeIdToken(
      tokens.idToken(),
    ) as { sub: string; name: string }

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.googleId, googleId))
      .limit(1)
      .then(takeUniqueOrNull)

    if (!existingUser) {
      // TODO: generate and set a session
      throw redirect({
        to: '/',
        code: 302,
      })
    }

    const user = await db
      .insert(usersTable)
      .values({ googleId, username })
      .returning()
      .then(takeUniqueOrNull)
    if (!user) {
      setResponseStatus(500)
      return new Response()
    }

    // TODO: generate and set a session
    throw redirect({
      to: '/',
      code: 302,
    })
  },
})
