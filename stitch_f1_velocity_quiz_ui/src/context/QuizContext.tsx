import React, {
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
import { socket } from '../utils/socket'

type Action =
  | { type: 'SET_LOADING' }
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
    case 'SET_LOADING':
      return { ...state, isLoading: true }
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
        // Wait for host to change phase
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
  const pendingLogin = React.useRef<{ username: string; avatar: string } | null>(null)

  const login = useCallback((username: string, avatar: string) => {
    dispatch({ type: 'SET_LOADING' })
    pendingLogin.current = { username, avatar }
    if (!socket.connected) socket.connect()
    socket.emit('request-join', { username, avatar })
  }, [])

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' })
    socket.disconnect()
  }, [])

  const startRace = useCallback(() => {
    // Only Admin can start race. Wait for socket event.
  }, [])

  const submitAnswer = useCallback((answerIndex: number) => {
    dispatch({ type: 'SUBMIT_ANSWER', answerIndex })
    socket.emit('submit-answer', { answer: answerIndex })
  }, [])

  // NO-OPs: Let Host control progression to prevent timers advancing
  const advanceFromLeaderboard = useCallback(() => {}, [])
  const advanceFromStatistics = useCallback(() => {}, [])

  const setReward = useCallback((reward: WheelPrize) => {
    dispatch({ type: 'SET_REWARD', reward })
  }, [])

  const finishWheel = useCallback(() => {
    dispatch({ type: 'FINISH_WHEEL' })
  }, [])

  React.useEffect(() => {
    const onApproved = () => {
      if (pendingLogin.current) {
        dispatch({ type: 'LOGIN', username: pendingLogin.current.username, avatar: pendingLogin.current.avatar })
      }
    }
    const onRejected = () => {
      alert('Your request to join was rejected by the host.')
      window.location.href = '/'
    }
    const onStartQuiz = () => dispatch({ type: 'START_RACE' })
    const onNextQuestion = () => dispatch({ type: 'ADVANCE_QUESTION' })
    const onShowLeaderboard = () => dispatch({ type: 'SET_PHASE', phase: 'leaderboard' })
    const onShowStatistics = () => dispatch({ type: 'SET_PHASE', phase: 'statistics' })
    const onSpinWheel = () => dispatch({ type: 'SET_PHASE', phase: 'wheel' })

    socket.on('player-approved', onApproved)
    socket.on('player-rejected', onRejected)
    socket.on('start-quiz', onStartQuiz)
    socket.on('next-question', onNextQuestion)
    socket.on('show-leaderboard', onShowLeaderboard)
    socket.on('show-statistics', onShowStatistics)
    socket.on('spin-wheel', onSpinWheel)

    return () => {
      socket.off('player-approved', onApproved)
      socket.off('player-rejected', onRejected)
      socket.off('start-quiz', onStartQuiz)
      socket.off('next-question', onNextQuestion)
      socket.off('show-leaderboard', onShowLeaderboard)
      socket.off('show-statistics', onShowStatistics)
      socket.off('spin-wheel', onSpinWheel)
    }
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
