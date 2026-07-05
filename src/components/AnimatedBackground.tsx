import { motion } from 'framer-motion'

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="track-streak absolute left-[-20%] top-24 h-1 w-[140%]"
        animate={{ x: ['-8%', '8%', '-8%'], opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="track-streak absolute bottom-28 left-[-10%] h-px w-[120%]"
        animate={{ x: ['6%', '-6%', '6%'], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(225,6,0,0.08),transparent_30%,rgba(0,219,233,0.06)_72%,transparent)]" />
      <div className="absolute inset-0 carbon-grid opacity-60" />
    </div>
  )
}
