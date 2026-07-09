import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gauge, Play, RadioTower, ShieldCheck, Users, Wifi } from 'lucide-react'
import { GlassCard } from '../components/GlassCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { PageLayout } from '../components/PageLayout'
import { PlayerAvatar } from '../components/PlayerAvatar'
import { useQuiz } from '../hooks/useQuiz'

export function LobbyPage() {
  const { user, leaderboard, startRace } = useQuiz()
  const navigate = useNavigate()

  const host = leaderboard.find((p) => p.isHost)
  const players = leaderboard.filter((p) => !p.isHost)
  const playerCount = players.length

  const handleStartRace = () => {
    startRace()
    navigate('/transition')
  }

  if (!user) {
    return (
      <PageLayout title="Waiting Lobby" isUnderwater={true}>
        <div className="flex flex-1 items-center justify-center relative z-10">
          <LoadingSpinner label="Connecting..." />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Waiting Lobby" isUnderwater={true}>
      <div className="mx-auto w-full max-w-3xl space-y-6 relative z-10" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
            <Wifi className="h-4 w-4" aria-hidden="true" />
            Connected
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span>
              <strong className="text-white">{playerCount}</strong> explorers on board
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Telemetry', value: 'Stable', icon: RadioTower, tone: 'text-cyan-400' },
            { label: 'Dive Mode', value: 'Sprint', icon: Gauge, tone: 'text-[#00d4ff]' },
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
            <PlayerAvatar avatar={host.avatar} username={host.username} sizePx={56} fontSize="1.3rem" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Lobby Host</p>
              <p className="font-display text-xl font-bold">{host.username}</p>
              <p className="text-sm text-white/50 font-semibold">Session controller - Ready to dive</p>
            </div>
          </GlassCard>
        )}

        <GlassCard>
          <h2 className="mb-4 font-display text-lg font-bold uppercase italic tracking-wide">
            Explorer Grid
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4" aria-label="Connected players">
            {players.map((player, index) => (
              <motion.li
                key={player.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className={`flex items-center gap-2 rounded-xl p-3 ${
                  player.isCurrentUser ? 'bg-cyan-500/20 ring-1 ring-cyan-400/40 shadow-[0_0_12px_rgba(0,212,255,0.2)]' : 'bg-white/5'
                }`}
              >
                <PlayerAvatar avatar={player.avatar} username={player.username} sizePx={32} fontSize="0.75rem" />
                <span className="truncate text-sm font-semibold text-white">
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
          <LoadingSpinner label="Waiting for dive start..." />

          <motion.button
            type="button"
            onClick={handleStartRace}
            className="flex items-center gap-3 rounded-2xl px-10 py-4 font-display text-xl font-bold uppercase italic tracking-wide text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #00d4ff 0%, #0078ff 50%, #003ec0 100%)',
              border: '1px solid rgba(0, 205, 255, 0.42)',
              boxShadow: '0 0 20px rgba(0,200,255,0.45), 0 4px 28px rgba(0,80,255,0.4)',
              cursor: 'pointer',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="h-6 w-6 fill-current" aria-hidden="true" />
            Start Dive
          </motion.button>
        </div>
      </div>
    </PageLayout>
  )
}
