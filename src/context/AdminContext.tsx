import { useCallback, useMemo, useReducer, type ReactNode } from 'react'
import type { AdminQuizStatus, AdminState } from '../types'
import { AdminContext } from './adminContextInstance'

type AdminAction =
  | { type: 'LOGIN'; roomCode: string; adminPin: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_STATUS'; status: AdminQuizStatus; lastAction: string }
  | { type: 'NEXT_QUESTION' }

const initialState: AdminState = {
  session: null,
  quizStatus: 'idle',
  currentQuestionIndex: 0,
  playersJoined: 0,
  lastAction: 'Admin console standing by.',
}

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        session: {
          roomCode: action.roomCode,
          adminPin: action.adminPin,
        },
        quizStatus: 'idle',
        currentQuestionIndex: 0,
        playersJoined: 0,
        lastAction: 'Admin authenticated locally. Ready to create a lobby.',
      }
    case 'LOGOUT':
      return initialState
    case 'SET_STATUS':
      return {
        ...state,
        quizStatus: action.status,
        playersJoined:
          action.status === 'lobby-created' && state.playersJoined === 0
            ? 6
            : state.playersJoined,
        lastAction: action.lastAction,
      }
    case 'NEXT_QUESTION':
      return {
        ...state,
        quizStatus: 'live',
        currentQuestionIndex: state.currentQuestionIndex + 1,
        lastAction: `Advanced to question ${state.currentQuestionIndex + 2}.`,
      }
    default:
      return state
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState)

  const loginAdmin = useCallback((roomCode: string, adminPin: string) => {
    dispatch({ type: 'LOGIN', roomCode, adminPin })
  }, [])

  const logoutAdmin = useCallback(() => {
    dispatch({ type: 'LOGOUT' })
  }, [])

  const createLobby = useCallback(() => {
    dispatch({
      type: 'SET_STATUS',
      status: 'lobby-created',
      lastAction: 'Mock lobby created. Backend room creation will attach here later.',
    })
  }, [])

  const startQuiz = useCallback(() => {
    dispatch({
      type: 'SET_STATUS',
      status: 'live',
      lastAction: 'Quiz started locally. Socket question sync will attach here later.',
    })
  }, [])

  const showLeaderboard = useCallback(() => {
    dispatch({
      type: 'SET_STATUS',
      status: 'leaderboard',
      lastAction: 'Leaderboard display requested.',
    })
  }, [])

  const showStatistics = useCallback(() => {
    dispatch({
      type: 'SET_STATUS',
      status: 'statistics',
      lastAction: 'Answer statistics display requested.',
    })
  }, [])

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' })
  }, [])

  const spinPrizeWheel = useCallback(() => {
    dispatch({
      type: 'SET_STATUS',
      status: 'wheel',
      lastAction: 'Prize wheel trigger queued for the final winner only.',
    })
  }, [])

  const endQuiz = useCallback(() => {
    dispatch({
      type: 'SET_STATUS',
      status: 'ended',
      lastAction: 'Quiz ended locally. Results broadcast will attach here later.',
    })
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      loginAdmin,
      logoutAdmin,
      createLobby,
      startQuiz,
      showLeaderboard,
      showStatistics,
      nextQuestion,
      spinPrizeWheel,
      endQuiz,
    }),
    [
      state,
      loginAdmin,
      logoutAdmin,
      createLobby,
      startQuiz,
      showLeaderboard,
      showStatistics,
      nextQuestion,
      spinPrizeWheel,
      endQuiz,
    ],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}
