import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  className?: string
  lines?: number
}

export function SkeletonLoader({ className = '', lines = 3 }: SkeletonLoaderProps) {
  return (
    <div className={`space-y-3 ${className}`} role="status" aria-label="Loading content">
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className="skeleton-shimmer h-4 rounded-lg"
          style={{ width: `${100 - i * 12}%` }}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="glass-panel space-y-4 p-6" role="status" aria-label="Loading">
      <div className="skeleton-shimmer h-6 w-1/3 rounded-lg" />
      <SkeletonLoader lines={4} />
    </div>
  )
}
