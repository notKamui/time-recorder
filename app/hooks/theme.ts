import { $setTheme } from '@server/functions/theme'
import { useServerFn } from '@tanstack/start'
import { createContext, useContext } from 'react'

export const ThemeContext = createContext({ theme: 'dark' })

export function useTheme() {
  const context = useContext(ThemeContext)
  const setTheme = useServerFn($setTheme)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return { ...context, setTheme }
}
