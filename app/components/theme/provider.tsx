import { ThemeContext } from '@app/hooks/use-theme'
import type { ReactNode } from 'react'

export function ThemeProvider({
  children,
  theme,
}: { children: ReactNode; theme: 'light' | 'dark' }) {
  return <ThemeContext value={{ theme }}>{children}</ThemeContext>
}
