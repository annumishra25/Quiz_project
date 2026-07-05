import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flag, UserRound, Zap } from 'lucide-react'
import { GlassCard } from '../components/GlassCard'
import { PageLayout } from '../components/PageLayout'
import { getAvatarColor, getInitials } from '../data/players'
import { useQuiz } from '../hooks/useQuiz'

const AVATAR_OPTIONS = Array.from({ length: 8 }, (_, index) => getAvatarColor(index))

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(1)
  const [error, setError] = useState('')
  const { login } = useQuiz()
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = username.trim()

    if (trimmed.length < 3) {
      setError('Username must be at least 3 characters.')
      return
    }

    setError('')
    login(trimmed, AVATAR_OPTIONS[selectedAvatar])
    navigate('/lobby')
  }

  return (
    <PageLayout>
      <div className="flex flex-1 flex-col items-center justify-center py-8">
        <motion.div
          className="mb-8 flex items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-f1-red/20 neon-glow">
            <Flag className="h-7 w-7 text-f1-red" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-display text-4xl font-extrabold italic uppercase tracking-tight sm:text-5xl">
              F1 Live Quiz
            </h1>
            <p className="text-sm uppercase tracking-widest text-white/50">Race Day Edition</p>
          </div>
        </motion.div>

        <GlassCard className="w-full max-w-md" glow>
          <div className="mb-6 flex items-center gap-2 text-f1-cyan">
            <Zap className="h-5 w-5" aria-hidden="true" />
            <span className="text-sm font-semibold uppercase tracking-wider">Enter the Grid</span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-white/70">
              Driver Name
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                if (error) setError('')
              }}
              placeholder="Enter your username..."
              className="mb-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-f1-on-surface placeholder:text-white/30 outline-none transition-colors focus:border-f1-red/50 focus:ring-2 focus:ring-f1-red/30"
              autoComplete="username"
              aria-describedby={error ? 'username-error' : undefined}
              aria-invalid={error ? true : undefined}
            />
            {error && (
              <p id="username-error" className="mb-4 text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
            {!error && <div className="mb-4" />}

            <fieldset className="mb-6">
              <legend className="mb-3 flex items-center gap-2 text-sm font-medium text-white/70">
                <UserRound className="h-4 w-4 text-f1-cyan" aria-hidden="true" />
                Driver Avatar
              </legend>
              <div className="grid grid-cols-4 gap-3">
                {AVATAR_OPTIONS.map((avatar, index) => {
                  const active = selectedAvatar === index
                  return (
                    <motion.button
                      key={avatar}
                      type="button"
                      onClick={() => setSelectedAvatar(index)}
                      className={`flex aspect-square items-center justify-center rounded-xl border text-sm font-bold text-white transition-all focus:outline-none focus:ring-2 focus:ring-f1-cyan/70 ${
                        active
                          ? 'border-f1-cyan bg-white/10 shadow-[0_0_18px_rgba(0,219,233,0.28)]'
                          : 'border-white/10 bg-white/5 hover:border-f1-red/60'
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      aria-pressed={active}
                      aria-label={`Select avatar ${index + 1}`}
                    >
                      <span className={`flex h-10 w-10 items-center justify-center rounded-full ${avatar}`}>
                        {getInitials(username.trim() || 'DR')}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </fieldset>

            <motion.button
              type="submit"
              className="w-full rounded-xl bg-f1-red px-6 py-3 font-display text-lg font-bold uppercase italic text-white transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-f1-cyan/70 neon-glow"
              whileTap={{ scale: 0.98 }}
            >
              Join Race
            </motion.button>
          </form>
        </GlassCard>
      </div>
    </PageLayout>
  )
}
