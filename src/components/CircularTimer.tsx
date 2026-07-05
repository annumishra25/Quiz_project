import { memo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const TOTAL_SECONDS = 30
const CIRCUMFERENCE = 2 * Math.PI * 45

interface CircularTimerProps {
  active: boolean
  onExpire: () => void
  onTick?: (remaining: number) => void
}

export const CircularTimer = memo(function CircularTimer({
  active,
  onExpire,
  onTick,
}: CircularTimerProps) {
  const [remaining, setRemaining] = useState(TOTAL_SECONDS)

  useEffect(() => {
    if (!active) {
      setRemaining(TOTAL_SECONDS)
      return
    }

    setRemaining(TOTAL_SECONDS)
    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1
        onTick?.(next)
        if (next <= 0) {
          clearInterval(interval)
          onExpire()
          return 0
        }
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [active, onExpire, onTick])

  const progress = remaining / TOTAL_SECONDS
  const offset = CIRCUMFERENCE * (1 - progress)
  const isCritical = remaining <= 10

  return (
    <div
      className="relative flex h-16 w-16 shrink-0 items-center justify-center"
      role="timer"
      aria-label={`${remaining} seconds remaining`}
      aria-live="off"
    >
      <svg className="timer-svg h-16 w-16 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={isCritical ? '#E10600' : '#00DBE9'}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: 'linear' }}
          className={isCritical ? 'timer-critical' : undefined}
        />
      </svg>
      <span
        className={`absolute font-display text-lg font-bold tabular-nums ${
          isCritical ? 'text-f1-red' : 'text-f1-cyan'
        }`}
      >
        {remaining}
      </span>
    </div>
  )
})
