import { ThemeProvider } from '@app/components/theme/provider'
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
    return { uiTheme, user }
  },
  component: () => {
    const { uiTheme, user } = Route.useLoaderData()

    return (
      <html lang="en" className={cn(uiTheme)}>
        <head>
          <Meta />
        </head>
        <body>
          <ThemeProvider theme={uiTheme}>
            <MainLayout user={user}>
              <Outlet />
            </MainLayout>
          </ThemeProvider>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    )
  },
})
