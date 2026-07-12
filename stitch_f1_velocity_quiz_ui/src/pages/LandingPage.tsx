import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Gauge, RadioTower, Trophy, Users } from 'lucide-react'
import { GlassCard } from '../components/GlassCard'
import { PageLayout } from '../components/PageLayout'

const highlights = [
  { label: 'Live lobby', value: '20 explorers', icon: Users, tone: 'text-cyan-400' },
  { label: 'Deep dive', value: '30 sec', icon: Gauge, tone: 'text-[#00d4ff]' },
  { label: 'Podium reveal', value: 'Top 3', icon: Trophy, tone: 'text-emerald-400' },
]

export function LandingPage() {
  return (
    <PageLayout isUnderwater={true}>
      <section className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr] relative z-10" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <div>
          <motion.p
            className="mb-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold tracking-widest text-cyan-400 border border-cyan-500/30"
            style={{ background: 'rgba(0, 40, 95, 0.42)' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <RadioTower className="h-5 w-5 text-cyan-400 animate-pulse" aria-hidden="true" />
            Live Event Demo
          </motion.p>
          <motion.h1
            className="text-white drop-shadow-xl select-none"
            style={{
              fontFamily: "'Fredoka', sans-serif",
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#00e5ff',
              textShadow: '0 0 20px rgba(0,229,255,0.6)',
              animation: 'logo-glow 3s ease-in-out infinite',
            }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            Apex Velocity
          </motion.h1>
          <motion.p
            className="mt-5 max-w-2xl text-lg leading-8 drop-shadow-md font-semibold"
            style={{ color: 'rgba(135,210,255,0.85)' }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
          >
            A premium deep-sea quiz adventure with timed questions, live standings,
            interactive statistics reveals, and a finale prize wheel.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
          >
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-[2rem] px-8 py-4 font-display text-2xl font-black uppercase text-white shadow-[0_8px_0_rgba(0,0,0,0.2)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_0_rgba(0,0,0,0.2)] active:translate-y-2 active:shadow-none focus:outline-none"
              style={{
                background: 'linear-gradient(135deg, #00d4ff 0%, #0078ff 50%, #003ec0 100%)',
                border: '1px solid rgba(0, 205, 255, 0.42)',
                boxShadow: '0 0 20px rgba(0,200,255,0.45), 0 4px 28px rgba(0,80,255,0.4)',
                cursor: 'pointer',
              }}
            >
              Enter Event
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </Link>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#event-preview"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-cyan-500/20 bg-[#00285f]/40 px-6 py-4 font-bold text-cyan-300 transition-all hover:border-cyan-400 hover:bg-[#00285f]/60 hover:text-white focus:outline-none"
              >
                View Format
              </a>
              <Link
                to="/admin/login"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-purple-400/20 bg-purple-950/30 px-6 py-4 font-bold text-purple-300 transition-all hover:border-purple-400 hover:bg-purple-950/60 hover:text-white focus:outline-none"
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
          <div className="absolute inset-x-8 top-8 h-40 rounded-full bg-cyan-400/10 blur-3xl" aria-hidden="true" />
          <GlassCard className="relative overflow-hidden p-0 border-[2px] border-[#00b9ff]/22 shadow-[0_8px_70px_rgba(0,70,200,0.38)] bg-[#04122e]/60 backdrop-blur-3xl" glow={false}>
            <div className="border-b-[1.5px] border-[#00b9ff]/20 bg-white/[0.03] px-5 py-4">
              <p className="text-sm font-black uppercase tracking-widest text-[#00e5ff] drop-shadow-sm select-none">
                Dive Control Preview
              </p>
            </div>
            <div className="space-y-5 p-5">
              <div className="rounded-3xl border-2 border-[#00b9ff]/30 p-5 shadow-inner" style={{ background: 'rgba(0, 14, 40, 0.56)' }}>
                <p className="text-xs font-extrabold uppercase tracking-wider text-cyan-400">Current Question</p>
                <p className="mt-2 font-display text-2xl font-black text-white drop-shadow-md leading-normal">
                  Which marine animal is known to have three hearts and blue blood?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Jellyfish', 'Octopus', 'Shark', 'Dolphin'].map((answer, index) => (
                  <div
                    key={answer}
                    className={`rounded-2xl border-2 p-4 text-base font-bold text-center transition-all select-none ${
                      index === 1
                        ? 'border-cyan-400 text-white shadow-lg'
                        : 'border-white/10 text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                    style={{
                      background: index === 1 ? 'rgba(0, 18, 48, 0.88)' : 'rgba(0, 14, 40, 0.56)',
                      boxShadow: index === 1 ? '0 0 14px rgba(0,212,255,0.22)' : 'none'
                    }}
                  >
                    {answer}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {highlights.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="rounded-2xl border-2 border-white/5 p-4 text-center" style={{ background: 'rgba(0, 14, 40, 0.4)' }}>
                      <Icon className={`mb-2 h-8 w-8 ${item.tone} mx-auto drop-shadow-md`} aria-hidden="true" />
                      <p className="text-[10px] font-bold uppercase text-white/50">{item.label}</p>
                      <p className="font-display text-lg font-bold text-white mt-0.5">{item.value}</p>
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
