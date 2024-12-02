import { ThemeProvider } from '@app/components/theme/provider'
import { MainLayout } from '@app/layouts/main'
import appCss from '@app/styles/index.css?url'
import { cn } from '@app/utils/cn'
import { $getTheme } from '@server/functions/theme'
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
  loader: async () => {
    const { uiTheme } = await $getTheme()
    return { uiTheme }
  },
  component: () => {
    const { uiTheme } = Route.useLoaderData()

    return (
      <html lang="en" className={cn(uiTheme)}>
        <head>
          <Meta />
        </head>
        <body>
          <ThemeProvider theme={uiTheme}>
            <MainLayout>
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
