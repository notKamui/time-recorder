import { google } from '@/utils/google'
import { redirect } from '@tanstack/react-router'
import { createAPIFileRoute } from '@tanstack/start/api'
import { generateCodeVerifier, generateState } from 'arctic'
import { setCookie as _setCookie } from 'vinxi/server'

export const APIRoute = createAPIFileRoute('/api/login/google')({
  GET: () => {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()
    const url = google.createAuthorizationURL(state, codeVerifier, [
      'openid',
      'profile',
    ])

    function setCookie(name: string, value: string) {
      _setCookie(name, value, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 10,
        sameSite: 'lax',
      })
    }

    setCookie('google_oauth_state', state)
    setCookie('google_code_verifier', codeVerifier)

    throw redirect({
      to: url.toString(),
      code: 302,
    })
  },
})
