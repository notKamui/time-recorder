import { createContext, useContext } from 'react'

const ThemeContext = createContext({ theme: 'dark' })

export function ThemeProvider({
  children,
  theme,
}: { children: React.ReactNode; theme: 'light' | 'dark' }) {
  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
