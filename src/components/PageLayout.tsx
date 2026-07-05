import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Moon, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatedBackground } from './AnimatedBackground'
import { SettingsModal } from './SettingsModal'
import { useSettings } from '../hooks/useSettings'

interface PageLayoutProps {
  children: ReactNode
  title?: string
}

export function PageLayout({ children, title }: PageLayoutProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { theme, toggleTheme } = useSettings()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable

      if (isTyping) return

      if (event.key.toLowerCase() === 's') {
        event.preventDefault()
        setSettingsOpen(true)
      }

      if (event.key.toLowerCase() === 't') {
        event.preventDefault()
        toggleTheme()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleTheme])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <div className="scanline" aria-hidden="true" />
      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center justify-between gap-4" aria-label="Primary">
          <Link
            to="/"
            className="group flex items-center gap-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-f1-cyan"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-f1-red/40 bg-f1-red/15 font-display font-black italic text-f1-red neon-glow">
              AV
            </span>
            <span>
              <span className="block font-display text-lg font-black italic uppercase leading-none">
                Apex Velocity
              </span>
              <span className="text-xs uppercase tracking-[0.22em] text-white/40">
                {theme} mode
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:border-f1-cyan/60 hover:text-f1-cyan focus:outline-none focus:ring-2 focus:ring-f1-cyan"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              aria-label="Switch theme"
              title="Switch theme (T)"
            >
              <Moon className="h-5 w-5" aria-hidden="true" />
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:border-f1-red/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-f1-cyan"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              aria-label="Open settings"
              title="Open settings (S)"
            >
              <Settings className="h-5 w-5" aria-hidden="true" />
            </motion.button>
          </div>
        </nav>
        {title && (
          <header className="mb-8 text-center">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-f1-red">
              Apex Velocity
            </p>
            <h1 className="font-display text-3xl font-bold italic uppercase tracking-tight sm:text-4xl">
              {title}
            </h1>
          </header>
        )}
        {children}
      </main>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
