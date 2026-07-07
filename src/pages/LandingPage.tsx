import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Gauge, RadioTower, Trophy, Users } from 'lucide-react'
import { GlassCard } from '../components/GlassCard'
import { PageLayout } from '../components/PageLayout'

const highlights = [
  { label: 'Live lobby', value: '20 drivers', icon: Users },
  { label: 'Timed laps', value: '30 sec', icon: Gauge },
  { label: 'Podium reveal', value: 'Top 3', icon: Trophy },
]

export function LandingPage() {
  return (
    <PageLayout>
      <section className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.p
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-f1-cyan/30 bg-f1-cyan/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-f1-cyan"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <RadioTower className="h-4 w-4" aria-hidden="true" />
            Live Event Demo
          </motion.p>
          <motion.h1
            className="font-display text-5xl font-black italic uppercase leading-none sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            Apex Velocity
          </motion.h1>
          <motion.p
            className="mt-5 max-w-2xl text-lg leading-8 text-white/65"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
          >
            A premium Formula 1 quiz experience with timed questions, live-looking standings,
            statistics reveals, and a finale prize wheel.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
          >
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-f1-red px-6 py-3 font-display text-lg font-black italic uppercase text-white neon-glow transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-f1-cyan"
            >
              Enter Event
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#event-preview"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-bold text-white/80 transition hover:border-f1-cyan/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-f1-cyan"
              >
                View Format
              </a>
              <Link
                to="/admin/login"
                className="inline-flex items-center justify-center rounded-xl border border-f1-red/30 bg-f1-red/10 px-6 py-3 font-bold text-red-100 transition hover:border-f1-red hover:text-white focus:outline-none focus:ring-2 focus:ring-f1-cyan"
              >
                Host Login
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          id="event-preview"
          className="relative"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18, duration: 0.55 }}
        >
          <div className="absolute inset-x-8 top-8 h-40 rounded-full bg-f1-red/20 blur-3xl" aria-hidden="true" />
          <GlassCard className="relative overflow-hidden p-0" glow>
            <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/45">
                Race Control Preview
              </p>
            </div>
            <div className="space-y-5 p-5">
              <div className="rounded-xl border border-f1-red/30 bg-f1-red/10 p-4">
                <p className="text-xs uppercase tracking-widest text-f1-red">Current Question</p>
                <p className="mt-2 font-display text-2xl font-black italic">
                  Which circuit hosts the night race under Marina Bay lights?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['Monaco', 'Singapore', 'Suzuka', 'Silverstone'].map((answer, index) => (
                  <div
                    key={answer}
                    className={`rounded-xl border p-3 text-sm font-semibold ${
                      index === 1
                        ? 'border-f1-cyan/50 bg-f1-cyan/15 text-f1-cyan'
                        : 'border-white/10 bg-white/5 text-white/60'
                    }`}
                  >
                    {String.fromCharCode(65 + index)}. {answer}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {highlights.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <Icon className="mb-2 h-5 w-5 text-f1-cyan" aria-hidden="true" />
                      <p className="text-xs uppercase tracking-wider text-white/40">{item.label}</p>
                      <p className="font-display font-bold">{item.value}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </section>
    </PageLayout>
  )
}
