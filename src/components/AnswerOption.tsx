import { memo } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'

interface AnswerOptionProps {
  option: string
  index: number
  isSelected: boolean
  isCorrect: boolean
  showResult: boolean
  disabled: boolean
  onSelect: (index: number) => void
}

export const AnswerOption = memo(function AnswerOption({
  option,
  index,
  isSelected,
  isCorrect,
  showResult,
  disabled,
  onSelect,
}: AnswerOptionProps) {
  let stateClasses =
    'bg-white/5 border-white/10 hover:border-f1-red/50 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-f1-red/50'

  if (showResult) {
    if (isCorrect) {
      stateClasses = 'bg-emerald-500/20 border-emerald-500/50 ring-1 ring-emerald-500/30'
    } else if (isSelected) {
      stateClasses = 'bg-red-500/20 border-red-500/50 ring-1 ring-red-500/30'
    } else {
      stateClasses = 'bg-white/5 border-white/10 opacity-50'
    }
  } else if (isSelected) {
    stateClasses = 'bg-f1-red/15 border-f1-red/60 ring-2 ring-f1-red/40 scale-[1.02]'
  }

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(index)}
      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors outline-none ${stateClasses} ${
        disabled ? 'cursor-default' : 'cursor-pointer'
      }`}
      initial={false}
      animate={
        showResult && isCorrect
          ? { scale: [1, 1.03, 1], transition: { duration: 0.4 } }
          : showResult && isSelected && !isCorrect
            ? { x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.45 } }
            : isSelected
              ? { scale: 1.02 }
              : { scale: 1 }
      }
      whileHover={disabled ? undefined : { scale: 1.01, y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      aria-pressed={isSelected}
      aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-f1-red/20 font-display font-bold text-f1-red">
        {String.fromCharCode(65 + index)}
      </span>
      <span className="flex-1 font-medium">{option}</span>
      {showResult && isCorrect && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
        </motion.div>
      )}
      {showResult && isSelected && !isCorrect && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <XCircle className="h-5 w-5 shrink-0 text-red-400" aria-hidden="true" />
        </motion.div>
      )}
    </motion.button>
  )
})
