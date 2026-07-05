import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  SettingsContext,
  type SettingsContextValue,
  type ThemeMode,
} from './settingsContextInstance'

const themes: ThemeMode[] = ['midnight', 'neon', 'contrast']

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('midnight')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const index = themes.indexOf(current)
      return themes[(index + 1) % themes.length]
    })
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.dataset.motion = reducedMotion ? 'reduced' : 'full'
  }, [theme, reducedMotion])

  const value = useMemo<SettingsContextValue>(
    () => ({
      reducedMotion,
      soundEnabled,
      theme,
      setReducedMotion,
      setSoundEnabled,
      setTheme,
      toggleTheme,
    }),
    [reducedMotion, soundEnabled, theme, toggleTheme],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
