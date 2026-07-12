import { createContext } from 'react'
import type { QuizContextValue } from '../types'

export const QuizContext = createContext<QuizContextValue | null>(null)
