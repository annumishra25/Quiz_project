import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react'
import { GlassCard } from '../components/GlassCard'
import { PageLayout } from '../components/PageLayout'
import { useAdmin } from '../hooks/useAdmin'

function normalizeRoomCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, '-')
}

export function AdminLoginPage() {
  const [roomCode, setRoomCode] = useState('')
  const [adminPin, setAdminPin] = useState('')
  const [error, setError] = useState('')
  const { loginAdmin } = useAdmin()
  const navigate = useNavigate()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const normalizedRoomCode = normalizeRoomCode(roomCode)
    const trimmedPin = adminPin.trim()

    if (normalizedRoomCode.length < 4) {
      setError('Room code must be at least 4 characters.')
      return
    }

    if (!/^\d{4,8}$/.test(trimmedPin)) {
      setError('Admin PIN must be 4 to 8 digits.')
      return
    }

    setError('')
    loginAdmin(normalizedRoomCode, trimmedPin)
    navigate('/admin/dashboard')
  }

  return (
    <PageLayout>
      <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-f1-cyan/30 bg-f1-cyan/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-f1-cyan">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Admin Race Control
          </p>
          <h1 className="font-display text-5xl font-black italic uppercase leading-none sm:text-6xl">
            Command the Grid
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/65">
            Mock host access for creating lobbies, starting rounds, advancing questions, and
            controlling the live quiz presentation.
          </p>
        </motion.section>

        <GlassCard glow className="mx-auto w-full max-w-md">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-f1-red/30 bg-f1-red/15">
              <LockKeyhole className="h-6 w-6 text-f1-red" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/40">
                Secure Mock Login
              </p>
              <h2 className="font-display text-2xl font-black italic uppercase">Host Access</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="room-code" className="mb-2 block text-sm font-semibold text-white/70">
                Room Code
              </label>
              <input
                id="room-code"
                type="text"
                value={roomCode}
                onChange={(event) => {
                  setRoomCode(event.target.value)
                  if (error) setError('')
                }}
                placeholder="APEX-2026"
                autoComplete="off"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-display uppercase text-f1-on-surface outline-none transition placeholder:font-body placeholder:normal-case placeholder:text-white/30 focus:border-f1-cyan/60 focus:ring-2 focus:ring-f1-cyan/25"
                aria-describedby={error ? 'admin-login-error' : undefined}
                aria-invalid={error ? true : undefined}
              />
            </div>

            <div>
              <label htmlFor="admin-pin" className="mb-2 block text-sm font-semibold text-white/70">
                Admin PIN
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-f1-cyan" />
                <input
                  id="admin-pin"
                  type="password"
                  inputMode="numeric"
                  value={adminPin}
                  onChange={(event) => {
                    setAdminPin(event.target.value)
                    if (error) setError('')
                  }}
                  placeholder="4-8 digit PIN"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-f1-on-surface outline-none transition placeholder:text-white/30 focus:border-f1-red/60 focus:ring-2 focus:ring-f1-red/25"
                  aria-describedby={error ? 'admin-login-error' : undefined}
                  aria-invalid={error ? true : undefined}
                />
              </div>
            </div>

            {error && (
              <p id="admin-login-error" className="text-sm font-medium text-red-300" role="alert">
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-f1-red px-6 py-3 font-display text-lg font-black italic uppercase text-white neon-glow transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-f1-cyan"
              whileTap={{ scale: 0.98 }}
            >
              Enter Dashboard
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </motion.button>
          </form>
        </GlassCard>
      </div>
    </PageLayout>
  )
}
