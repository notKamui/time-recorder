import { AppSidebar } from '@app/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@app/components/ui/breadcrumb'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@app/components/ui/sidebar'
import { useCrumbs } from '@app/hooks/use-crumbs'
import { Separator } from '@radix-ui/react-separator'
import { Link } from '@tanstack/react-router'
import { Fragment, type ReactNode } from 'react'

export function MainLayout({ children }: { children: ReactNode }) {
  const breadcrumbs = useCrumbs()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <>
                  <BreadcrumbItem key={breadcrumb.title}>
                    {breadcrumb.to && index < breadcrumbs.length - 1 ? (
                      <BreadcrumbLink asChild>
                        <Link to={breadcrumb.to}>{breadcrumb.title}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator key={index} className="hidden md:block" />
                  )}
                </>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="size-full p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
