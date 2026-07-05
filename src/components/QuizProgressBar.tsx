import { memo } from 'react'
import { motion } from 'framer-motion'

interface QuizProgressBarProps {
  current: number
  total: number
  revealed?: boolean
}

export const QuizProgressBar = memo(function QuizProgressBar({
  current,
  total,
  revealed = false,
}: QuizProgressBarProps) {
  const progress = total > 0 ? ((current + (revealed ? 1 : 0)) / total) * 100 : 0

  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="flex items-center justify-between text-xs uppercase tracking-wider text-white/40">
        <span>Race Progress</span>
        <span className="tabular-nums">
          {Math.min(current + (revealed ? 1 : 0), total)}/{total}
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Question progress: ${Math.round(progress)}%`}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-f1-red to-f1-red-glow"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
})
