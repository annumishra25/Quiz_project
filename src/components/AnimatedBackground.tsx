import { motion } from 'framer-motion'

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="track-streak absolute left-[-20%] top-24 h-2 w-[140%] opacity-80"
        animate={{ x: ['-8%', '8%', '-8%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="track-streak absolute bottom-32 left-[-10%] h-3 w-[120%] opacity-60"
        animate={{ x: ['6%', '-6%', '6%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="track-streak absolute top-[50%] left-[-30%] h-1 w-[160%] opacity-40 bg-white"
        animate={{ x: ['-12%', '12%', '-12%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.1),transparent_40%,rgba(255,255,255,0.05)_70%,transparent)]" />
      <div className="absolute inset-0 carbon-grid opacity-20 mix-blend-overlay" />
    </div>
  )
}
