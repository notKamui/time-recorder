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
import { ClockIcon, HomeIcon, LogInIcon, LogOutIcon } from 'lucide-react'

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
  condition?: (user: PublicUser | null) => boolean
}

const sidebar: SidebarSection[] = [
  {
    id: 'main',
    name: 'Main',
    items: [{ title: 'Home', url: '/', icon: HomeIcon }] as const,
  },
  {
    id: 'time',
    name: 'Time recorder',
    items: [
      {
        title: 'Time',
        url: '/time',
        icon: ClockIcon,
      },
    ] as const,
    condition: (user) => !!user,
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
]

export function AppSidebar({ user }: { user: PublicUser | null }) {
  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className={title({ h: 2 })}>Miniverso</h1>
      </SidebarHeader>
      <SidebarContent>
        {sidebar.map((section) =>
          section.condition?.(user) === false ? null : (
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
          ),
        )}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
