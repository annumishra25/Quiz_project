import { motion } from 'framer-motion'
import { Minus, TrendingDown, TrendingUp, Trophy, Wifi } from 'lucide-react'
import type { Player } from '../types'
import { GlassCard } from './GlassCard'
import { PlayerAvatar } from './PlayerAvatar'

interface LeaderboardPanelProps {
  players: Player[]
  currentUsername: string
}

export function LeaderboardPanel({ players, currentUsername }: LeaderboardPanelProps) {
  const ranked = [...players]
    .filter((p) => !p.isHost)
    .sort((a, b) => b.score - a.score)
  const podium = ranked.slice(0, 3)

  const getPodiumStyle = (rank: number) => {
    if (rank === 0) return 'border-b-4 border-yellow-400'
    if (rank === 1) return 'border-b-4 border-gray-300'
    if (rank === 2) return 'border-b-4 border-amber-700'
    return ''
  }

  return (
    <GlassCard className="w-full max-w-2xl mx-auto" glow>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-f1-red" aria-hidden="true" />
          <h2 className="font-display text-2xl font-bold italic uppercase tracking-tight">
            Live Standings
          </h2>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
          Live
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 items-end gap-3" aria-label="Top three podium">
        {[podium[1], podium[0], podium[2]].map((player, visualIndex) => {
          if (!player) return <div key={visualIndex} />

          const rank = ranked.findIndex((rankedPlayer) => rankedPlayer.id === player.id) + 1
          const height = rank === 1 ? 'h-28' : rank === 2 ? 'h-24' : 'h-20'
          const tone =
            rank === 1
              ? 'from-yellow-400/30 to-yellow-400/5 text-yellow-300'
              : rank === 2
                ? 'from-slate-200/25 to-slate-200/5 text-slate-200'
                : 'from-amber-700/30 to-amber-700/5 text-amber-300'

          return (
            <motion.div
              key={player.id}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: visualIndex * 0.08, type: 'spring', stiffness: 260, damping: 22 }}
            >
              <PlayerAvatar avatar={player.avatar} username={player.username} sizePx={48} fontSize="1rem" />
              <p className="max-w-full truncate text-xs font-semibold">{player.username}</p>
              <div
                className={`${height} flex w-full flex-col items-center justify-end rounded-t-xl border border-white/10 bg-gradient-to-b ${tone} px-2 pb-3`}
              >
                <span className="font-display text-2xl font-black">{rank}</span>
                <span className="text-xs font-bold tabular-nums">{player.score}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <ul className="space-y-2" aria-label="Leaderboard rankings">
        {ranked.map((player, index) => {
          const isCurrent =
            player.isCurrentUser ||
            player.username.toLowerCase() === currentUsername.toLowerCase()
          const movement = index % 3 === 0 ? 'up' : index % 3 === 1 ? 'down' : 'same'

          return (
            <motion.li
              key={player.id}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-colors ${
                isCurrent
                  ? 'bg-f1-red/20 ring-1 ring-f1-red/50 neon-glow'
                  : 'bg-white/5'
              } ${getPodiumStyle(index)}`}
              aria-current={isCurrent ? 'true' : undefined}
            >
              <span
                className={`w-8 text-center font-display text-lg font-bold ${
                  index < 3 ? 'text-f1-cyan' : 'text-white/40'
                }`}
              >
                {index + 1}
              </span>
              <PlayerAvatar avatar={player.avatar} username={player.username} sizePx={40} fontSize="0.85rem" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">
                  {player.username}
                  {isCurrent && (
                    <span className="ml-2 text-xs uppercase tracking-wider text-f1-red">
                      (You)
                    </span>
                  )}
                </p>
              </div>
              <span className="font-display text-lg font-bold tabular-nums text-f1-cyan">
                {player.score.toLocaleString()}
              </span>
              <span className="flex w-5 justify-center" aria-label={`Rank movement ${movement}`}>
                {movement === 'up' && <TrendingUp className="h-4 w-4 text-emerald-400" />}
                {movement === 'down' && <TrendingDown className="h-4 w-4 text-red-400" />}
                {movement === 'same' && <Minus className="h-4 w-4 text-white/30" />}
              </span>
            </motion.li>
          )
        })}
      </ul>
    </GlassCard>
  )
}
