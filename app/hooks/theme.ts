import { createContext, useContext } from 'react'

export const ThemeContext = createContext({ theme: 'dark' })

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
