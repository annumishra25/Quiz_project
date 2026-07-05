import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from './useQuiz'

const LEADERBOARD_DELAY_MS = 3000
const STATISTICS_DELAY_MS = 3000
const ANSWER_REVEAL_DELAY_MS = 2000

export function useQuizFlow() {
  const navigate = useNavigate()
  const {
    phase,
    currentQuestionIndex,
    advanceFromLeaderboard,
    advanceFromStatistics,
  } = useQuiz()

  const goToWheel = useCallback(() => {
    navigate('/wheel')
  }, [navigate])

  useEffect(() => {
    if (phase === 'wheel') goToWheel()
  }, [phase, goToWheel])

  useEffect(() => {
    if (phase !== 'leaderboard') return
    const timer = setTimeout(advanceFromLeaderboard, LEADERBOARD_DELAY_MS)
    return () => clearTimeout(timer)
  }, [phase, currentQuestionIndex, advanceFromLeaderboard])

  useEffect(() => {
    if (phase !== 'statistics') return
    const timer = setTimeout(advanceFromStatistics, STATISTICS_DELAY_MS)
    return () => clearTimeout(timer)
  }, [phase, currentQuestionIndex, advanceFromStatistics])

  return { ANSWER_REVEAL_DELAY_MS }
}

export function usePreviousRanks(leaderboard: { id: string; score: number; isHost?: boolean }[]) {
  const prevRanksRef = useRef<Map<string, number>>(new Map())

  const ranked = [...leaderboard]
    .filter((p) => !p.isHost)
    .sort((a, b) => b.score - a.score)

  const currentRanks = new Map(ranked.map((p, i) => [p.id, i + 1]))
  const previousRanks = new Map(prevRanksRef.current)

  useEffect(() => {
    prevRanksRef.current = currentRanks
  })

  return { previousRanks, currentRanks }
}
