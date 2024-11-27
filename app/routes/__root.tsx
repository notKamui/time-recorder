import { ThemeProvider } from '@/components/theme/provider'
import { $getTheme } from '@/server/theme'
import appCss from '@/styles/index.css?url'
import { cn } from '@/utils/cn'
import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from '@tanstack/react-router'
import { Meta, Scripts } from '@tanstack/start'
import type { ReactNode } from 'react'

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
        title: 'TanStack Start Starter',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
  loader: async () => {
    const { uiTheme } = await $getTheme()
    return { uiTheme }
  },
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { uiTheme } = Route.useLoaderData()

  return (
    <html lang="en" className={cn(uiTheme)}>
      <head>
        <Meta />
      </head>
      <body>
        <ThemeProvider theme={uiTheme}>{children}</ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
