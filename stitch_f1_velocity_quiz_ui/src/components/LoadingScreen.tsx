import { motion } from 'framer-motion'
import { Gauge, RadioTower } from 'lucide-react'

export function LoadingScreen() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070707] px-6">
      <div className="absolute inset-0 carbon-grid opacity-70" aria-hidden="true" />
      <motion.div
        className="relative z-10 w-full max-w-sm text-center"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-f1-red/40 bg-f1-red/10 neon-glow">
          <Gauge className="h-9 w-9 text-f1-red" aria-hidden="true" />
        </div>
        <p className="mb-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.32em] text-f1-cyan">
          <RadioTower className="h-4 w-4" aria-hidden="true" />
          Syncing Telemetry
        </p>
        <h1 className="font-display text-4xl font-black italic uppercase">Apex Velocity</h1>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-f1-red via-white to-f1-cyan"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </div>
  )
}
