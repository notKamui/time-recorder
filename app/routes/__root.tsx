import { ThemeProvider } from '@app/components/theme/provider'
import { Toaster } from '@app/components/ui/sonner'
import { crumbs } from '@app/hooks/use-crumbs'
import { useEvent } from '@app/hooks/use-event'
import { MainLayout } from '@app/layouts/main'
import appCss from '@app/styles/index.css?url'
import { cn } from '@app/utils/cn'
import { tryAsync } from '@common/utils/try'
import { $getTheme } from '@server/functions/theme'
import { $authenticate } from '@server/functions/user'
import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from '@tanstack/react-router'
import { Meta, Scripts } from '@tanstack/start'
import { outdent } from 'outdent'
import { toast } from 'sonner'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Time Recorder',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
    scripts: import.meta.env.PROD
      ? []
      : [
          {
            type: 'module',
            children: outdent /* js */`
              import RefreshRuntime from "/_build/@react-refresh"
              RefreshRuntime.injectIntoGlobalHook(window)
              window.$RefreshReg$ = () => {}
              window.$RefreshSig$ = () => (type) => type
            `,
          },
        ],
  }),
  beforeLoad: async () => {
    const [error, result] = await tryAsync($authenticate())
    if (error) {
      return { session: null, user: null }
    }
    return { session: result.session, user: result.user }
  },
  loader: async ({ context: { user } }) => {
    const { uiTheme } = await $getTheme()
    return { uiTheme, user, crumbs: crumbs({ title: 'Home', to: '/' }) }
  },
  component: () => {
    const uiTheme = Route.useLoaderData({ select: (state) => state.uiTheme })

    useEvent('server-error', (event) => {
      toast.error(event.detail.body.error, { richColors: true })
    })

    return (
      <html lang="en" className={cn(uiTheme)}>
        <head>
          <Meta />
        </head>
        <body>
          <ThemeProvider theme={uiTheme}>
            <MainLayout>
              <Outlet />
              <Toaster />
            </MainLayout>
          </ThemeProvider>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    )
  },
})
