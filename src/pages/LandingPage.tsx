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
            className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-f1-cyan bg-white px-5 py-2 text-sm font-bold tracking-widest text-f1-surface shadow-md"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <RadioTower className="h-5 w-5 text-f1-cyan" aria-hidden="true" />
            Live Event Demo
          </motion.p>
          <motion.h1
            className="font-display text-6xl font-black uppercase leading-tight text-white drop-shadow-xl sm:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            Apex Velocity
          </motion.h1>
          <motion.p
            className="mt-5 max-w-2xl text-xl leading-8 text-white/90 drop-shadow-md font-bold"
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
              className="inline-flex items-center justify-center gap-2 rounded-[2rem] bg-gradient-to-r from-f1-red to-f1-red-glow px-8 py-4 font-display text-2xl font-black uppercase text-white shadow-[0_8px_0_rgba(0,0,0,0.2)] transition hover:-translate-y-1 hover:shadow-[0_12px_0_rgba(0,0,0,0.2)] active:translate-y-2 active:shadow-none focus:outline-none"
            >
              Enter Event
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </Link>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#event-preview"
                className="inline-flex items-center justify-center rounded-2xl border-4 border-white/20 bg-white/10 px-6 py-4 font-bold text-white transition hover:border-f1-cyan hover:bg-f1-cyan/20 focus:outline-none"
              >
                View Format
              </a>
              <Link
                to="/admin/login"
                className="inline-flex items-center justify-center rounded-2xl border-4 border-purple-400/30 bg-purple-500/20 px-6 py-4 font-bold text-purple-100 transition hover:border-purple-400 hover:bg-purple-500/40 focus:outline-none"
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
          <div className="absolute inset-x-8 top-8 h-40 rounded-full bg-yellow-400/30 blur-3xl" aria-hidden="true" />
          <GlassCard className="relative overflow-hidden p-0 border-[4px] border-white/50" glow>
            <div className="border-b-[3px] border-white/20 bg-white/[0.08] px-5 py-4">
              <p className="text-sm font-black uppercase tracking-widest text-white drop-shadow-sm">
                Race Control Preview
              </p>
            </div>
            <div className="space-y-5 p-5">
              <div className="rounded-3xl border-4 border-yellow-400 bg-yellow-400/20 p-5 shadow-inner">
                <p className="text-sm font-bold uppercase text-yellow-300 drop-shadow-sm">Current Question</p>
                <p className="mt-2 font-display text-3xl font-black text-white drop-shadow-md">
                  Which circuit hosts the night race under Marina Bay lights?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Monaco', 'Singapore', 'Suzuka', 'Silverstone'].map((answer, index) => (
                  <div
                    key={answer}
                    className={`rounded-2xl border-[3px] p-4 text-lg font-bold text-center transition hover:scale-105 cursor-pointer ${
                      index === 1
                        ? 'border-f1-cyan bg-f1-cyan text-white shadow-lg'
                        : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {answer}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {highlights.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="rounded-2xl border-4 border-white/20 bg-black/20 p-4 text-center">
                      <Icon className="mb-2 h-8 w-8 text-f1-cyan mx-auto drop-shadow-md" aria-hidden="true" />
                      <p className="text-xs font-bold uppercase text-white/70">{item.label}</p>
                      <p className="font-display text-xl font-bold text-white">{item.value}</p>
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
