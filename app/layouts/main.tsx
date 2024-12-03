import { AppSidebar } from '@app/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@app/components/ui/sidebar'
import type { ReactNode } from 'react'

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="size-full p-4">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
