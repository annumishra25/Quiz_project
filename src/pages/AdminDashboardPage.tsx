import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart3,
  CircleDot,
  Flag,
  Gauge,
  LogOut,
  Play,
  RadioTower,
  RotateCw,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react'
import { GlassCard } from '../components/GlassCard'
import { PageLayout } from '../components/PageLayout'
import { questions } from '../data/questions'
import { useAdmin } from '../hooks/useAdmin'

const statusLabels = {
  idle: 'Standby',
  'lobby-created': 'Lobby Created',
  live: 'Quiz Live',
  leaderboard: 'Leaderboard',
  statistics: 'Statistics',
  wheel: 'Prize Wheel',
  ended: 'Ended',
}

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const {
    session,
    quizStatus,
    currentQuestionIndex,
    playersJoined,
    lastAction,
    logoutAdmin,
    createLobby,
    startQuiz,
    showLeaderboard,
    showStatistics,
    nextQuestion,
    spinPrizeWheel,
    endQuiz,
  } = useAdmin()

  const currentQuestion = questions[currentQuestionIndex] ?? questions[questions.length - 1]
  const controls = useMemo(
    () => [
      { label: 'Create Lobby', icon: RadioTower, onClick: createLobby },
      { label: 'Start Quiz', icon: Play, onClick: startQuiz },
      { label: 'Show Leaderboard', icon: Trophy, onClick: showLeaderboard },
      { label: 'Show Statistics', icon: BarChart3, onClick: showStatistics },
      { label: 'Next Question', icon: RotateCw, onClick: nextQuestion },
      { label: 'Spin Prize Wheel', icon: Sparkles, onClick: spinPrizeWheel },
      { label: 'End Quiz', icon: Flag, onClick: endQuiz, danger: true },
    ],
    [
      createLobby,
      endQuiz,
      nextQuestion,
      showLeaderboard,
      showStatistics,
      spinPrizeWheel,
      startQuiz,
    ],
  )

  const handleLogout = () => {
    logoutAdmin()
    navigate('/admin/login')
  }

  return (
    <PageLayout title="Admin Dashboard">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-f1-cyan">
              Host Race Control
            </p>
            <h2 className="mt-2 font-display text-3xl font-black italic uppercase">
              {session?.roomCode} Control Room
            </h2>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white/70 transition hover:border-f1-red/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-f1-cyan"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Exit Admin
          </button>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Admin room status">
          {[
            { label: 'Room Code', value: session?.roomCode ?? 'None', icon: RadioTower },
            { label: 'Admin PIN', value: session?.adminPin ?? 'None', icon: Gauge },
            { label: 'Players Joined', value: playersJoined.toString(), icon: Users },
            { label: 'Quiz Status', value: statusLabels[quizStatus], icon: CircleDot },
          ].map((item, index) => {
            const Icon = item.icon
            return (
              <GlassCard key={item.label} className="p-4">
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <Icon className="h-5 w-5 text-f1-cyan" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-widest text-white/40">{item.label}</p>
                    <p className="truncate font-display text-xl font-black italic">{item.value}</p>
                  </div>
                </motion.div>
              </GlassCard>
            )
          })}
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <GlassCard glow>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-f1-red">
                  Current Question
                </p>
                <h3 className="mt-2 font-display text-2xl font-black italic">
                  Question {Math.min(currentQuestionIndex + 1, questions.length)} / {questions.length}
                </h3>
              </div>
              <div className="rounded-full border border-f1-cyan/30 bg-f1-cyan/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-f1-cyan">
                {statusLabels[quizStatus]}
              </div>
            </div>
            <p className="text-xl font-semibold leading-8 text-white/85">{currentQuestion.question}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={option}
                  className={`rounded-xl border p-3 text-sm font-semibold ${
                    index === currentQuestion.correctAnswer
                      ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
                      : 'border-white/10 bg-white/5 text-white/60'
                  }`}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-f1-cyan">
              Admin Actions
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {controls.map((control) => {
                const Icon = control.icon
                return (
                  <motion.button
                    key={control.label}
                    type="button"
                    onClick={control.onClick}
                    className={`flex min-h-16 items-center gap-3 rounded-xl border px-4 py-3 text-left font-bold transition focus:outline-none focus:ring-2 focus:ring-f1-cyan ${
                      control.danger
                        ? 'border-red-400/25 bg-red-500/10 text-red-100 hover:border-red-400/60'
                        : 'border-white/10 bg-white/5 text-white/75 hover:border-f1-cyan/60 hover:text-white'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="h-5 w-5 shrink-0 text-f1-cyan" aria-hidden="true" />
                    {control.label}
                  </motion.button>
                )
              })}
            </div>
            <div className="mt-5 rounded-xl border border-f1-red/20 bg-f1-red/10 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-f1-red">Last Action</p>
              <p className="mt-2 text-sm leading-6 text-white/70">{lastAction}</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageLayout>
  )
}
