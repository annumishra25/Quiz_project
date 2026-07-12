import { createContext } from 'react'

export type ThemeMode = 'midnight' | 'neon' | 'contrast'

export interface SettingsContextValue {
  reducedMotion: boolean
  soundEnabled: boolean
  theme: ThemeMode
  setReducedMotion: (value: boolean) => void
  setSoundEnabled: (value: boolean) => void
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)
