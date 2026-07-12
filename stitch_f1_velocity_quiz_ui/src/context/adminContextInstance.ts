import { createContext } from 'react'
import type { AdminContextValue } from '../types'

export const AdminContext = createContext<AdminContextValue | null>(null)
