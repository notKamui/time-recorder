import { AppSidebar } from '@app/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@app/components/ui/sidebar'
import type { PublicUser } from '@server/db/schema'
import type { ReactNode } from 'react'

export function MainLayout({
  children,
  user,
}: { children: ReactNode; user: PublicUser | null }) {
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
