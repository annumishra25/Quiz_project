import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crown, Gauge, Play, RadioTower, ShieldCheck, Users, Wifi } from 'lucide-react'
import { GlassCard } from '../components/GlassCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { PageLayout } from '../components/PageLayout'
import { getInitials } from '../data/players'
import { useQuiz } from '../hooks/useQuiz'

export function LobbyPage() {
  const { user, leaderboard, startRace } = useQuiz()
  const navigate = useNavigate()

  const host = leaderboard.find((p) => p.isHost)
  const players = leaderboard.filter((p) => !p.isHost)
  const playerCount = players.length

  const handleStartRace = () => {
    startRace()
    navigate('/quiz')
  }

  if (!user) {
    return (
      <PageLayout title="Waiting Lobby">
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner label="Connecting..." />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Waiting Lobby">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
            <Wifi className="h-4 w-4" aria-hidden="true" />
            Connected
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span>
              <strong className="text-white">{playerCount}</strong> drivers on grid
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Telemetry', value: 'Stable', icon: RadioTower, tone: 'text-f1-cyan' },
            { label: 'Race Mode', value: 'Sprint', icon: Gauge, tone: 'text-f1-red' },
            { label: 'Grid Check', value: 'Ready', icon: ShieldCheck, tone: 'text-emerald-400' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <GlassCard key={item.label} className="p-4">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${item.tone}`} aria-hidden="true" />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/40">{item.label}</p>
                    <p className="font-display text-lg font-bold italic">{item.value}</p>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>

        {host && (
          <GlassCard className="flex items-center gap-4" glow>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-f1-red/20">
              <Crown className="h-7 w-7 text-yellow-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-f1-red">Race Host</p>
              <p className="font-display text-xl font-bold">{host.username}</p>
              <p className="text-sm text-white/50">Session controller - Ready to deploy</p>
            </div>
          </GlassCard>
        )}

        <GlassCard>
          <h2 className="mb-4 font-display text-lg font-bold uppercase italic tracking-wide">
            Driver Grid
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4" aria-label="Connected players">
            {players.map((player, index) => (
              <motion.li
                key={player.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className={`flex items-center gap-2 rounded-xl p-3 ${
                  player.isCurrentUser ? 'bg-f1-red/20 ring-1 ring-f1-red/40' : 'bg-white/5'
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${player.avatar}`}
                  aria-hidden="true"
                >
                  {getInitials(player.username)}
                </div>
                <span className="truncate text-sm font-medium">
                  {player.username}
                  {player.isCurrentUser && (
                    <span className="sr-only"> (you)</span>
                  )}
                </span>
              </motion.li>
            ))}
          </ul>
        </GlassCard>

        <div className="flex flex-col items-center gap-6 py-4">
          <LoadingSpinner label="Waiting for race start..." />

          <motion.button
            type="button"
            onClick={handleStartRace}
            className="flex items-center gap-3 rounded-2xl bg-f1-red px-10 py-4 font-display text-xl font-bold uppercase italic tracking-wide text-white neon-glow transition-transform hover:scale-[1.02]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="h-6 w-6 fill-current" aria-hidden="true" />
            Start Race
          </motion.button>
        </div>
      </div>
    </PageLayout>
  )
}
