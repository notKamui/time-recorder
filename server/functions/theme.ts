import '@server/middlewares/global'
import { validate } from '@server/utils/validate'
import { createServerFn } from '@tanstack/start'
import { z } from 'vinxi'
import { getCookie, setCookie } from 'vinxi/http'

const ThemeSchema = z.object({
  theme: z.enum(['light', 'dark']).default('dark'),
})

export const $setTheme = createServerFn({ method: 'POST' })
  .validator(validate(ThemeSchema))
  .handler(async ({ data }) => {
    setCookie('ui-theme', data.theme, {
      sameSite: 'strict',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
  })

export const $getTheme = createServerFn({ method: 'GET' }).handler(async () => {
  let uiTheme = getCookie('ui-theme') as 'light' | 'dark' | undefined
  if (!uiTheme) {
    uiTheme = 'dark'
    setCookie('ui-theme', uiTheme, {
      sameSite: 'strict',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
  }
  return {
    uiTheme,
  }
})
