import { motion } from 'framer-motion'

export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="relative h-14 w-14">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/10 border-t-f1-red"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border border-f1-cyan/30 border-b-f1-cyan"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <p className="text-sm font-semibold uppercase tracking-widest text-white/60">{label}</p>
    </div>
  )
}
