import {
  useCallback,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { questions } from '../data/questions'
import { generateMockPlayers, updateLeaderboardScores } from '../data/players'
import type {
  AnswerRecord,
  Player,
  QuizContextValue,
  QuizPhase,
  QuizState,
  WheelPrize,
} from '../types'
import {
  applyRewardBonus,
  buildAnswerStatistics,
  calculateScore,
  getAccuracy,
  getWinner,
} from '../utils/quizHelpers'
import { QuizContext } from './quizContextInstance'

type Action =
  | { type: 'LOGIN'; username: string; avatar: string }
  | { type: 'LOGOUT' }
  | { type: 'START_RACE' }
  | { type: 'SUBMIT_ANSWER'; answerIndex: number }
  | { type: 'SET_PHASE'; phase: QuizPhase }
  | { type: 'ADVANCE_QUESTION' }
  | { type: 'SET_REWARD'; reward: WheelPrize }
  | { type: 'FINISH_WHEEL' }
  | { type: 'RESTART' }

const initialState: QuizState = {
  user: null,
  userAvatar: null,
  questions,
  currentQuestionIndex: 0,
  answers: [],
  leaderboard: [],
  score: 0,
  phase: 'login',
  reward: null,
  isLoading: false,
}

function quizReducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case 'LOGIN': {
      const leaderboard = generateMockPlayers(action.username, action.avatar)
      return {
        ...state,
        user: action.username,
        userAvatar: action.avatar,
        leaderboard,
        phase: 'lobby',
        isLoading: false,
      }
    }
    case 'LOGOUT':
      return { ...initialState }
    case 'START_RACE':
      return {
        ...state,
        phase: 'question',
        currentQuestionIndex: 0,
        answers: [],
        score: 0,
        reward: null,
      }
    case 'SUBMIT_ANSWER': {
      const question = state.questions[state.currentQuestionIndex]
      if (!question || !state.user) return state

      const isCorrect = action.answerIndex === question.correctAnswer
      const newAnswer: AnswerRecord = {
        questionId: question.id,
        selectedAnswer: action.answerIndex,
        isCorrect,
      }
      const answers = [...state.answers, newAnswer]
      const score = calculateScore(answers)
      const leaderboard = updateLeaderboardScores(state.leaderboard, state.user, score)

      return {
        ...state,
        answers,
        score,
        leaderboard,
        phase: 'leaderboard',
      }
    }
    case 'SET_PHASE':
      return { ...state, phase: action.phase }
    case 'ADVANCE_QUESTION': {
      const nextIndex = state.currentQuestionIndex + 1
      if (nextIndex >= state.questions.length) {
        return { ...state, phase: 'wheel' }
      }
      return {
        ...state,
        currentQuestionIndex: nextIndex,
        phase: 'question',
      }
    }
    case 'SET_REWARD':
      return { ...state, reward: action.reward }
    case 'FINISH_WHEEL': {
      const finalScore = applyRewardBonus(state.score, state.reward)
      const leaderboard = state.user
        ? updateLeaderboardScores(
            state.leaderboard.map((p) =>
              p.isCurrentUser ? { ...p, score: finalScore } : p,
            ),
            state.user,
            finalScore,
          )
        : state.leaderboard
      return {
        ...state,
        score: finalScore,
        leaderboard,
        phase: 'results',
      }
    }
    case 'RESTART':
      return { ...initialState }
    default:
      return state
  }
}


export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  const login = useCallback((username: string, avatar: string) => {
    dispatch({ type: 'LOGIN', username, avatar })
  }, [])

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' })
  }, [])

  const startRace = useCallback(() => {
    dispatch({ type: 'START_RACE' })
  }, [])

  const submitAnswer = useCallback((answerIndex: number) => {
    dispatch({ type: 'SUBMIT_ANSWER', answerIndex })
  }, [])

  const advanceFromLeaderboard = useCallback(() => {
    dispatch({ type: 'SET_PHASE', phase: 'statistics' })
  }, [])

  const advanceFromStatistics = useCallback(() => {
    dispatch({ type: 'ADVANCE_QUESTION' })
  }, [])

  const setReward = useCallback((reward: WheelPrize) => {
    dispatch({ type: 'SET_REWARD', reward })
  }, [])

  const finishWheel = useCallback(() => {
    dispatch({ type: 'FINISH_WHEEL' })
  }, [])

  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' })
  }, [])

  const getCurrentQuestion = useCallback(() => {
    return state.questions[state.currentQuestionIndex] ?? null
  }, [state.questions, state.currentQuestionIndex])

  const getAnswerStatistics = useCallback(() => {
    const question = state.questions[state.currentQuestionIndex]
    const lastAnswer = state.answers[state.answers.length - 1]
    if (!question || !lastAnswer) return []
    return buildAnswerStatistics(question, lastAnswer.selectedAnswer)
  }, [state.questions, state.currentQuestionIndex, state.answers])

  const getAccuracyValue = useCallback(() => {
    return getAccuracy(state.answers)
  }, [state.answers])

  const getWinnerValue = useCallback((): Player | null => {
    return getWinner(state.leaderboard)
  }, [state.leaderboard])

  const value = useMemo<QuizContextValue>(
    () => ({
      ...state,
      login,
      logout,
      startRace,
      submitAnswer,
      advanceFromLeaderboard,
      advanceFromStatistics,
      setReward,
      finishWheel,
      restart,
      getCurrentQuestion,
      getAnswerStatistics,
      getAccuracy: getAccuracyValue,
      getWinner: getWinnerValue,
    }),
    [
      state,
      login,
      logout,
      startRace,
      submitAnswer,
      advanceFromLeaderboard,
      advanceFromStatistics,
      setReward,
      finishWheel,
      restart,
      getCurrentQuestion,
      getAnswerStatistics,
      getAccuracyValue,
      getWinnerValue,
    ],
  )

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}
