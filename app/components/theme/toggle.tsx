import { Moon, Sun } from 'lucide-react'

import { Button } from '@app/components/ui/button'
import { useTheme } from '@app/hooks/use-theme'
import { useRouter } from '@tanstack/react-router'

export function ThemeToggle() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  function toggleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme({ data: { theme: newTheme } }).then(() => router.invalidate())
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <Sun className="dark:-rotate-90 size-2 rotate-0 scale-100 transition-all dark:scale-0" />
      <Moon className="absolute size-1 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
