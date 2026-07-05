import { memo, useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface AnimatedScoreProps {
  value: number
  className?: string
}

export const AnimatedScore = memo(function AnimatedScore({ value, className = '' }: AnimatedScoreProps) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 })
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString())
  const [text, setText] = useState('0')

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  useEffect(() => {
    return display.on('change', (v) => setText(String(v)))
  }, [display])

  return (
    <motion.span className={`tabular-nums ${className}`} aria-label={`Score: ${value}`}>
      {text}
    </motion.span>
  )
})
