import { title } from '@app/components/ui/primitives/typography'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@app/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { HomeIcon, LogInIcon } from 'lucide-react'

const items = [
  {
    title: 'Home',
    url: '/',
    icon: HomeIcon,
  },
  {
    title: 'Login',
    url: '/login',
    icon: LogInIcon,
  },
] as const

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className={title({ h: 2 })}>Time Recorder</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
