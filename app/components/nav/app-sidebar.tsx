import {
  AppNavGroup,
  type AppNavGroupProps,
} from '@app/components/nav/app-nav-group'
import { title } from '@app/components/ui/primitives/typography'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@app/components/ui/sidebar'
import { useSidebar } from '@app/hooks/use-sidebar'
import {
  ClockIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  StarIcon,
} from 'lucide-react'
import { motion } from 'motion/react'

const sections: AppNavGroupProps[] = [
  {
    title: 'Applications',
    items: [
      {
        title: 'Home',
        to: '/',
        icon: HomeIcon,
      },
      {
        title: 'Time',
        to: '/time',
        icon: ClockIcon,
        condition: ({ user }) => !!user,
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        title: 'Log In',
        to: '/login',
        icon: LogInIcon,
        condition: ({ user }) => !user,
      },
      {
        title: 'Log Out',
        to: '/logout',
        icon: LogOutIcon,
        condition: ({ user }) => !!user,
      },
    ],
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <Header />
      <SidebarContent>
        {sections.map((section) => (
          <AppNavGroup key={section.title} {...section} />
        ))}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

function Header() {
  const { open } = useSidebar()
  const MotionIcon = motion(StarIcon)
  return (
    <SidebarHeader className="flex flex-row justify-between">
      <motion.h1
        className={title({ h: 1 })}
        animate={{ opacity: open ? 1 : 0, x: open ? 0 : -100 }}
        transition={{
          duration: 0.2,
        }}
      >
        Miniverso
      </motion.h1>
      <div>
        <MotionIcon
          className="absolute inset-0 top-4 left-4 h-8 w-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: open ? 0 : 1 }}
        />
      </div>
    </SidebarHeader>
  )
}
