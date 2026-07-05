import { Navigate, Outlet } from 'react-router-dom'
import { useQuiz } from '../hooks/useQuiz'

interface ProtectedRouteProps {
  redirectTo?: string
}

export function ProtectedRoute({ redirectTo = '/login' }: ProtectedRouteProps) {
  const { user } = useQuiz()

  if (!user) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}

export function GuestRoute() {
  const { user } = useQuiz()

  if (user) {
    return <Navigate to="/lobby" replace />
  }

  return <Outlet />
}
