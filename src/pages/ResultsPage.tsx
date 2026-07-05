import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Award, RefreshCw, Target, Trophy, User } from 'lucide-react'
import { ConfettiBurst } from '../components/ConfettiBurst'
import { GlassCard } from '../components/GlassCard'
import { LeaderboardPanel } from '../components/LeaderboardPanel'
import { PageLayout } from '../components/PageLayout'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { getInitials } from '../data/players'
import { useQuiz } from '../hooks/useQuiz'

export function ResultsPage() {
  const { user, score, reward, leaderboard, getAccuracy, getWinner, restart } = useQuiz()
  const navigate = useNavigate()

  const winner = getWinner()
  const accuracy = getAccuracy()
  const currentPlayer = leaderboard.find(
    (p) => p.isCurrentUser || (user && p.username.toLowerCase() === user.toLowerCase()),
  )

  const handleRestart = () => {
    restart()
    navigate('/')
  }

  if (!user) {
    return (
      <PageLayout title="Final Results">
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Final Results">
      <ConfettiBurst />
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {winner && (
          <GlassCard className="text-center" glow>
            <Trophy className="mx-auto mb-3 h-12 w-12 text-yellow-400" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400/80">
              Race Winner
            </p>
            <motion.p
              className="font-display text-4xl font-extrabold italic uppercase text-yellow-400"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {winner.username}
            </motion.p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-white">
              {winner.score.toLocaleString()} pts
            </p>
          </GlassCard>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <GlassCard>
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ${currentPlayer?.avatar ?? 'bg-f1-red'}`}
              >
                {getInitials(user)}
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs uppercase tracking-widest text-white/50">
                  <User className="h-3.5 w-3.5" aria-hidden="true" />
                  Your Result
                </div>
                <p className="font-display text-xl font-bold">{user}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-f1-cyan" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50">Final Score</p>
                <p className="font-display text-2xl font-bold tabular-nums text-f1-cyan">
                  {score.toLocaleString()}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-f1-red" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50">Accuracy</p>
                <p className="font-display text-2xl font-bold tabular-nums">{accuracy}%</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-400" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50">Bonus Reward</p>
                <p className="font-display text-lg font-bold text-yellow-400">
                  {reward ?? 'None'}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        <motion.button
          type="button"
          onClick={handleRestart}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-f1-red px-8 py-4 font-display text-xl font-bold uppercase italic tracking-wide text-white neon-glow transition-transform hover:scale-[1.02]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RefreshCw className="h-6 w-6" aria-hidden="true" />
          Play Again
        </motion.button>

        <LeaderboardPanel players={leaderboard} currentUsername={user} />
      </div>
    </PageLayout>
  )
}
