import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Timer, XCircle } from 'lucide-react'
import { AnswerStatisticsPopup } from '../components/AnswerStatisticsPopup'
import { AnimatedScore } from '../components/AnimatedScore'
import { CircularTimer } from '../components/CircularTimer'
import { GlassCard } from '../components/GlassCard'
import { LeaderboardPanel } from '../components/LeaderboardPanel'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { PageLayout } from '../components/PageLayout'
import { QuizProgressBar } from '../components/QuizProgressBar'
import { useQuiz } from '../hooks/useQuiz'
import { useQuizKeyboard } from '../hooks/useQuizKeyboard'
import { useSoundEffects } from '../hooks/useSoundEffects'

export function QuizPage() {
  const navigate = useNavigate()
  const {
    user,
    phase,
    currentQuestionIndex,
    questions,
    answers,
    score,
    leaderboard,
    submitAnswer,
    advanceFromLeaderboard,
    advanceFromStatistics,
    getCurrentQuestion,
    getAnswerStatistics,
  } = useQuiz()

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const { playCorrect, playWrong } = useSoundEffects()

  const question = getCurrentQuestion()
  const totalQuestions = questions.length

  const goToWheel = useCallback(() => {
    navigate('/wheel')
  }, [navigate])

  useEffect(() => {
    if (phase === 'wheel') {
      goToWheel()
    }
  }, [phase, goToWheel])

  useEffect(() => {
    if (phase !== 'question') return
    setSelectedAnswer(null)
    setRevealed(false)
  }, [phase, currentQuestionIndex])

  useEffect(() => {
    if (phase !== 'leaderboard') return

    const timer = window.setTimeout(() => {
      advanceFromLeaderboard()
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [phase, currentQuestionIndex, advanceFromLeaderboard])

  useEffect(() => {
    if (phase !== 'statistics') return

    const timer = window.setTimeout(() => {
      advanceFromStatistics()
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [phase, currentQuestionIndex, advanceFromStatistics])

  const handleSelectAnswer = useCallback(
    (index: number) => {
      if (revealed || selectedAnswer !== null || !question) return

      setSelectedAnswer(index)
      setRevealed(true)
      if (index === question.correctAnswer) {
        playCorrect()
      } else {
        playWrong()
      }

      window.setTimeout(() => {
        submitAnswer(index)
      }, 2000)
    },
    [playCorrect, playWrong, question, revealed, selectedAnswer, submitAnswer],
  )

  useQuizKeyboard(question?.options.length ?? 0, phase !== 'question' || revealed, handleSelectAnswer)

  const handleTimerExpire = useCallback(() => {
    if (!question || revealed || selectedAnswer !== null) return

    const fallbackAnswer = question.options.findIndex(
      (_, index) => index !== question.correctAnswer,
    )
    handleSelectAnswer(fallbackAnswer >= 0 ? fallbackAnswer : 0)
  }, [handleSelectAnswer, question, revealed, selectedAnswer])

  if (!user) {
    return (
      <PageLayout title="Race Quiz">
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      </PageLayout>
    )
  }

  if (!question && phase === 'question') {
    return (
      <PageLayout title="Race Quiz">
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner label="Loading question..." />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Race Quiz">
      <AnimatePresence mode="wait">
        {phase === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 flex-col items-center justify-center py-8"
          >
            <LeaderboardPanel players={leaderboard} currentUsername={user} />
            <p className="mt-6 text-sm uppercase tracking-widest text-white/40" aria-live="polite">
              Loading statistics...
            </p>
          </motion.div>
        )}

        {phase === 'statistics' && (
          <motion.div
            key="statistics-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-1 items-center justify-center"
          >
            <LeaderboardPanel players={leaderboard} currentUsername={user} />
            <AnswerStatisticsPopup
              statistics={getAnswerStatistics()}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              correctAnswerIndex={question?.correctAnswer}
            />
          </motion.div>
        )}

        {phase === 'question' && question && (
          <motion.div
            key={`question-${question.id}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="mx-auto w-full max-w-3xl"
          >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Timer className="h-4 w-4 text-f1-cyan" aria-hidden="true" />
                <span>
                  Lap <strong className="text-white">{currentQuestionIndex + 1}</strong> /{' '}
                  {totalQuestions}
                </span>
              </div>
              <QuizProgressBar
                current={currentQuestionIndex}
                total={totalQuestions}
                revealed={revealed}
              />
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="text-right text-sm font-bold text-f1-cyan">
                  <AnimatedScore value={score} /> pts
                  <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                    {answers.filter((answer) => answer.isCorrect).length} correct
                  </p>
                </div>
                <CircularTimer
                  active={phase === 'question' && !revealed}
                  onExpire={handleTimerExpire}
                />
              </div>
            </div>

            <GlassCard glow className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-f1-red">
                Question {currentQuestionIndex + 1}
              </p>
              <h2 className="font-display text-2xl font-bold leading-snug sm:text-3xl">
                {question.question}
              </h2>
            </GlassCard>

            <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Answer options">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isCorrect = index === question.correctAnswer
                const showResult = revealed

                let stateClasses =
                  'bg-white/5 border-white/10 hover:border-f1-red/50 hover:bg-white/10'

                if (showResult) {
                  if (isCorrect) {
                    stateClasses =
                      'bg-emerald-500/20 border-emerald-500/50 ring-1 ring-emerald-500/30'
                  } else if (isSelected) {
                    stateClasses = 'bg-red-500/20 border-red-500/50 ring-1 ring-red-500/30'
                  } else {
                    stateClasses = 'bg-white/5 border-white/10 opacity-50'
                  }
                }

                return (
                  <motion.button
                    key={option}
                    type="button"
                    disabled={revealed}
                    onClick={() => handleSelectAnswer(index)}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${stateClasses} ${
                      revealed ? 'cursor-default' : 'cursor-pointer'
                    }`}
                    whileHover={revealed ? undefined : { scale: 1.01, y: -2 }}
                    whileTap={revealed ? undefined : { scale: 0.99 }}
                    aria-pressed={isSelected}
                    aria-disabled={revealed}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-f1-red/20 font-display font-bold text-f1-red">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 font-medium">{option}</span>
                    {showResult && isCorrect && (
                      <CheckCircle2
                        className="h-5 w-5 shrink-0 text-emerald-400"
                        aria-label="Correct"
                      />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle
                        className="h-5 w-5 shrink-0 text-red-400"
                        aria-label="Incorrect"
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {revealed && (
              <motion.p
                className="mt-6 text-center text-sm uppercase tracking-widest text-white/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                aria-live="polite"
              >
                {selectedAnswer === question.correctAnswer
                  ? 'Correct! +100 points'
                  : 'Incorrect - reviewing standings...'}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  )
}
