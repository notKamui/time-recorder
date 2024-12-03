import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@app/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@app/components/ui/sidebar'
import type { FileRoutesByTo } from '@app/gen/route-tree.gen'
import {
  type GlobalContext,
  useGlobalContext,
} from '@app/hooks/use-global-context'
import { Link } from '@tanstack/react-router'
import { ChevronRightIcon, type LucideIcon } from 'lucide-react'

export type NavGroupItem = {
  title: string
  isActive?: boolean
  icon?: LucideIcon
  condition?: (user: GlobalContext) => boolean
} & (
  | {
      to: keyof FileRoutesByTo
      items?: never
    }
  | {
      to?: never
      items: NavGroupSubItem[]
    }
)

export type NavGroupSubItem = {
  title: string
  to: keyof FileRoutesByTo
  condition?: (user: GlobalContext) => boolean
}

export type AppNavGroupProps = {
  title: string
  items: NavGroupItem[]
  condition?: (user: GlobalContext) => boolean
}

export function AppNavGroup({ title, items, condition }: AppNavGroupProps) {
  const context = useGlobalContext()

  if (condition?.(context) === false) {
    return null
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(
          (item) =>
            item.condition?.(context) !== false && (
              <Collapsible
                key={item.title + item.to}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <NavButton item={item} />
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map(
                        (subItem) =>
                          subItem.condition?.(context) !== false && (
                            <SidebarMenuSubItem
                              key={subItem.title + subItem.to}
                            >
                              <SidebarMenuSubButton asChild>
                                <Link to={subItem.to}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ),
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavButton({ item }: { item: NavGroupItem }) {
  if (item.to === undefined) {
    return (
      <SidebarMenuButton tooltip={item.title}>
        {item.icon && <item.icon />}
        <span>{item.title}</span>
        <CollapsibleTrigger asChild>
          <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        </CollapsibleTrigger>
      </SidebarMenuButton>
    )
  }

  return (
    <Link to={item.to}>
      <SidebarMenuButton tooltip={item.title}>
        {item.icon && <item.icon />}
        <span>{item.title}</span>
      </SidebarMenuButton>
    </Link>
  )
}
