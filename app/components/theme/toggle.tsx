import { Moon, Sun } from 'lucide-react'

import { $setTheme } from '@app/'
import { Button } from '@app/components/ui/button'
import { useTheme } from '@app/hooks/theme'
import { useRouter } from '@tanstack/react-router'

export function ThemeToggle() {
  const router = useRouter()
  const { theme } = useTheme()

  function toggleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    $setTheme({ data: { theme: newTheme } }).then(() => router.invalidate())
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <Sun className="dark:-rotate-90 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
