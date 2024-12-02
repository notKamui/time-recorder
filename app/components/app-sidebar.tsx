import { title } from '@app/components/ui/primitives/typography'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@app/components/ui/sidebar'
import type { FileRouteTypes } from '@app/gen/route-tree.gen'
import type { PublicUser } from '@server/db/schema'
import { Link } from '@tanstack/react-router'
import { HomeIcon, LogInIcon, LogOutIcon } from 'lucide-react'

type SidebarItem = {
  title: string
  url: FileRouteTypes['to']
  icon: React.ComponentType
  condition?: (user: PublicUser | null) => boolean
}

type SidebarSection = {
  id: string
  name: string
  items: SidebarItem[]
}

const sidebar = [
  {
    id: 'main',
    name: 'Main',
    items: [{ title: 'Home', url: '/', icon: HomeIcon }] as const,
  },
  {
    id: 'account',
    name: 'Account',
    items: [
      {
        title: 'Log In',
        url: '/login',
        icon: LogInIcon,
        condition: (user) => !user,
      },
      {
        title: 'Log Out',
        url: '/logout',
        icon: LogOutIcon,
        condition: (user) => !!user,
      },
    ] as const,
  },
] satisfies SidebarSection[]

export function AppSidebar({ user }: { user?: PublicUser | null }) {
  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className={title({ h: 2 })}>Time Recorder</h1>
      </SidebarHeader>
      <SidebarContent>
        {sidebar.map((section) => (
          <SidebarGroupContent key={section.id}>
            <SidebarGroupLabel>{section.name}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) =>
                item.condition?.(user) === false ? null : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        ))}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
