export type QuizPhase =
  | 'login'
  | 'lobby'
  | 'question'
  | 'leaderboard'
  | 'statistics'
  | 'wheel'
  | 'results'

export type WheelPrize =
  | '10 Bonus'
  | '20 Bonus'
  | '50 Bonus'
  | 'Double Score'
  | 'Extra Life'
  | 'Jackpot'
  | 'Pit Stop Pass'
  | 'Mystery Prize'

export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

export interface Player {
  id: string
  username: string
  score: number
  avatar: string
  isHost?: boolean
  isCurrentUser?: boolean
}

export interface AnswerRecord {
  questionId: number
  selectedAnswer: number
  isCorrect: boolean
}

export interface AnswerStatistic {
  optionIndex: number
  optionLabel: string
  percentage: number
  count: number
}

export interface QuizState {
  user: string | null
  userAvatar: string | null
  questions: Question[]
  currentQuestionIndex: number
  answers: AnswerRecord[]
  leaderboard: Player[]
  score: number
  phase: QuizPhase
  reward: WheelPrize | null
  isLoading: boolean
}

export interface QuizContextValue extends QuizState {
  login: (username: string, avatar: string) => void
  logout: () => void
  startRace: () => void
  submitAnswer: (answerIndex: number) => void
  advanceFromLeaderboard: () => void
  advanceFromStatistics: () => void
  setReward: (reward: WheelPrize) => void
  finishWheel: () => void
  restart: () => void
  getCurrentQuestion: () => Question | null
  getAnswerStatistics: () => AnswerStatistic[]
  getAccuracy: () => number
  getWinner: () => Player | null
}

export type AdminQuizStatus =
  | 'idle'
  | 'lobby-created'
  | 'live'
  | 'leaderboard'
  | 'statistics'
  | 'wheel'
  | 'ended'

export interface AdminSession {
  roomCode: string
  adminPin: string
}

export interface AdminState {
  session: AdminSession | null
  quizStatus: AdminQuizStatus
  currentQuestionIndex: number
  playersJoined: number
  lastAction: string
}

export interface AdminContextValue extends AdminState {
  loginAdmin: (roomCode: string, adminPin: string) => void
  logoutAdmin: () => void
  createLobby: () => void
  startQuiz: () => void
  showLeaderboard: () => void
  showStatistics: () => void
  nextQuestion: () => void
  spinPrizeWheel: () => void
  endQuiz: () => void
}
