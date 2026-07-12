import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Radio, Volume2, X, Zap } from 'lucide-react'
import { useEffect } from 'react'
import { useSettings } from '../hooks/useSettings'
import type { ThemeMode } from '../context/settingsContextInstance'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

const themeOptions: Array<{ value: ThemeMode; label: string }> = [
  { value: 'midnight', label: 'Midnight' },
  { value: 'neon', label: 'Neon' },
  { value: 'contrast', label: 'Contrast' },
]

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const {
    reducedMotion,
    soundEnabled,
    theme,
    setReducedMotion,
    setSoundEnabled,
    setTheme,
  } = useSettings()

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
        >
          <motion.div
            className="glass-panel w-full max-w-md p-5 shadow-[0_28px_90px_rgba(0,0,0,0.55)]"
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 18 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-f1-cyan">
                  Race Control
                </p>
                <h2 id="settings-title" className="font-display text-2xl font-black italic">
                  Settings
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-f1-cyan"
                aria-label="Close settings"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-5">
              <section>
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/70">
                  <Moon className="h-4 w-4 text-f1-cyan" aria-hidden="true" />
                  Theme
                </div>
                <div className="grid grid-cols-3 gap-2" role="group" aria-label="Theme switcher">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTheme(option.value)}
                      className={`rounded-xl border px-3 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-f1-cyan ${
                        theme === option.value
                          ? 'border-f1-cyan bg-f1-cyan/15 text-f1-cyan'
                          : 'border-white/10 bg-white/5 text-white/70 hover:border-f1-red/60'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </section>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                <span className="flex items-center gap-3">
                  <Volume2 className="h-5 w-5 text-f1-red" aria-hidden="true" />
                  <span>
                    <span className="block font-semibold">Sound hooks</span>
                    <span className="text-xs text-white/45">Placeholder-ready audio events</span>
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(event) => setSoundEnabled(event.target.checked)}
                  className="h-5 w-5 accent-f1-red"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                <span className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-f1-cyan" aria-hidden="true" />
                  <span>
                    <span className="block font-semibold">Reduced motion</span>
                    <span className="text-xs text-white/45">Tone down page and card animation</span>
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(event) => setReducedMotion(event.target.checked)}
                  className="h-5 w-5 accent-f1-cyan"
                />
              </label>

              <div className="rounded-xl border border-f1-cyan/20 bg-f1-cyan/10 p-3 text-xs text-white/55">
                <Radio className="mr-2 inline h-4 w-4 text-f1-cyan" aria-hidden="true" />
                Keyboard: use Tab to move, Enter/Space to activate, A-D or 1-4 for quiz answers,
                Escape to close this panel.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
