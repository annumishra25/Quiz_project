import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: ReactNode
  className?: string
  glow?: boolean
}

export function GlassCard({ children, className = '', glow = false }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-panel p-6 ${glow ? 'neon-glow' : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
}
