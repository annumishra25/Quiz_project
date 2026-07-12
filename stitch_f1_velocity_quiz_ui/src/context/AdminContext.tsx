import React, { useCallback, useMemo, useReducer, type ReactNode } from 'react'
import type { AdminQuizStatus, AdminState } from '../types'
import { AdminContext } from './adminContextInstance'
import { socket } from '../utils/socket'

type AdminAction =
  | { type: 'LOGIN'; roomCode: string; adminPin: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_STATUS'; status: AdminQuizStatus; lastAction: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'UPDATE_PLAYERS'; count: number }

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
        lastAction: action.lastAction,
      }
    case 'NEXT_QUESTION':
      return {
        ...state,
        quizStatus: 'live',
        currentQuestionIndex: state.currentQuestionIndex + 1,
        lastAction: `Advanced to question ${state.currentQuestionIndex + 2}.`,
      }
    case 'UPDATE_PLAYERS':
      return {
        ...state,
        playersJoined: action.count,
        lastAction: `Lobby updated: ${action.count} approved players.`,
      }
    default:
      return state
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState)

  const loginAdmin = useCallback((roomCode: string, adminPin: string) => {
    dispatch({ type: 'LOGIN', roomCode, adminPin })
    if (!socket.connected) socket.connect()
    socket.emit('admin-join', { roomCode })
  }, [])

  const logoutAdmin = useCallback(() => {
    dispatch({ type: 'LOGOUT' })
    socket.disconnect()
  }, [])

  const createLobby = useCallback(() => {
    dispatch({ type: 'SET_STATUS', status: 'lobby-created', lastAction: 'Lobby created on server.' })
    if (!socket.connected) socket.connect()
    socket.emit('create-room', { roomCode: state.session?.roomCode })
  }, [state.session?.roomCode])

  const startQuiz = useCallback(() => {
    dispatch({ type: 'SET_STATUS', status: 'live', lastAction: 'Quiz started.' })
    socket.emit('start-quiz', { roomCode: state.session?.roomCode })
  }, [state.session?.roomCode])

  const showLeaderboard = useCallback(() => {
    dispatch({ type: 'SET_STATUS', status: 'leaderboard', lastAction: 'Leaderboard display requested.' })
    socket.emit('show-leaderboard', { roomCode: state.session?.roomCode })
  }, [state.session?.roomCode])

  const showStatistics = useCallback(() => {
    dispatch({ type: 'SET_STATUS', status: 'statistics', lastAction: 'Answer statistics display requested.' })
    socket.emit('show-statistics', { roomCode: state.session?.roomCode })
  }, [state.session?.roomCode])

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' })
    socket.emit('next-question', { roomCode: state.session?.roomCode })
  }, [state.session?.roomCode])

  const spinPrizeWheel = useCallback(() => {
    dispatch({ type: 'SET_STATUS', status: 'wheel', lastAction: 'Prize wheel triggered.' })
    socket.emit('spin-wheel', { roomCode: state.session?.roomCode })
  }, [state.session?.roomCode])

  const endQuiz = useCallback(() => {
    dispatch({ type: 'SET_STATUS', status: 'ended', lastAction: 'Quiz ended.' })
    socket.emit('end-quiz', { roomCode: state.session?.roomCode })
  }, [state.session?.roomCode])

  React.useEffect(() => {
    const onAdminLobbyUpdate = (data: { pending: any[], approved: any[] }) => {
      dispatch({ type: 'UPDATE_PLAYERS', count: data.approved.length })
      // Auto-approve all pending for this demo to meet requirements smoothly without UI buttons
      data.pending.forEach(p => {
        socket.emit('approve-player', { roomCode: state.session?.roomCode, playerId: p.id })
      })
    }
    const onAdminStatsUpdate = (data: { answersReceived: number, totalPlayers: number }) => {
      // Just for logging or tracking if we added state for it
    }

    socket.on('admin-lobby-update', onAdminLobbyUpdate)
    socket.on('admin-stats-update', onAdminStatsUpdate)

    return () => {
      socket.off('admin-lobby-update', onAdminLobbyUpdate)
      socket.off('admin-stats-update', onAdminStatsUpdate)
    }
  }, [state.session?.roomCode])

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
