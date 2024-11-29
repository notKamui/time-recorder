import { ThemeContext } from '@app/hooks/theme'

export function ThemeProvider({
  children,
  theme,
}: { children: React.ReactNode; theme: 'light' | 'dark' }) {
  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  )
}
