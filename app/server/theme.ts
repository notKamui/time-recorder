import { createServerFn } from '@tanstack/start'
import { z } from 'vinxi'
import { getCookie, setCookie } from 'vinxi/server'

const ThemeSchema = z.object({
  theme: z.enum(['light', 'dark']).default('dark'),
})

export const $setTheme = createServerFn({ method: 'POST' })
  .validator((data: z.infer<typeof ThemeSchema>) => ThemeSchema.parse(data))
  .handler(async ({ data }) => {
    console.log('Setting theme:', data.theme)

    setCookie('ui-theme', data.theme)
  })

export const $getTheme = createServerFn({ method: 'GET' }).handler(async () => {
  let uiTheme = getCookie('ui-theme') as 'light' | 'dark' | undefined
  if (!uiTheme) {
    uiTheme = 'dark'
    setCookie('ui-theme', uiTheme)
  }
  return {
    uiTheme,
  }
})
