import { Navigate, Outlet } from 'react-router-dom'
import { useAdmin } from '../hooks/useAdmin'

export function AdminRoute() {
  const { session } = useAdmin()

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
