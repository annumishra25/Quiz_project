import { motion } from 'framer-motion'
import { BarChart3, X } from 'lucide-react'
import type { AnswerStatistic } from '../types'

interface AnswerStatisticsPopupProps {
  statistics: AnswerStatistic[]
  questionNumber: number
  totalQuestions: number
  correctAnswerIndex?: number
  onClose?: () => void
}

export function AnswerStatisticsPopup({
  statistics,
  questionNumber,
  totalQuestions,
  correctAnswerIndex,
  onClose,
}: AnswerStatisticsPopupProps) {
  const totalResponses = statistics.reduce((sum, stat) => sum + stat.count, 0)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-title"
    >
      <motion.div
        className="glass-panel neon-glow-cyan w-full max-w-lg p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-f1-cyan" aria-hidden="true" />
            <div>
              <h2 id="stats-title" className="font-display text-xl font-bold italic uppercase">
                Answer Statistics
              </h2>
              <p className="text-sm text-white/50">
                Question {questionNumber} of {totalQuestions} - {totalResponses} responses
              </p>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close statistics"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <ul className="space-y-4" aria-label="Answer distribution">
          {statistics.map((stat, index) => (
            <li
              key={stat.optionIndex}
              className={
                stat.optionIndex === correctAnswerIndex
                  ? 'rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3'
                  : 'rounded-xl p-3'
              }
            >
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium">
                  <span className="mr-2 text-f1-cyan">Option {String.fromCharCode(65 + index)}</span>
                  {stat.optionLabel}
                  {stat.optionIndex === correctAnswerIndex && (
                    <span className="ml-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Correct
                    </span>
                  )}
                </span>
                <span className="font-display font-bold tabular-nums text-f1-cyan">
                  {stat.percentage}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className={`h-full rounded-full ${
                    stat.optionIndex === correctAnswerIndex
                      ? 'bg-gradient-to-r from-emerald-400 to-f1-cyan'
                      : 'bg-gradient-to-r from-f1-red to-f1-cyan'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.percentage}%` }}
                  transition={{ duration: 1.2, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  role="progressbar"
                  aria-valuenow={stat.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${stat.optionLabel}: ${stat.percentage}%`}
                />
              </div>
              <p className="mt-1 text-xs text-white/40">{stat.count} players chose this</p>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  )
}
