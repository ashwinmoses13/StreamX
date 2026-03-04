import { Navigate, useLocation } from 'react-router-dom'
import type { ReactElement } from 'react'

function hasSession() {
  try {
    const raw = localStorage.getItem('session')
    if (!raw) return false
    const s = JSON.parse(raw) as { email: string; at: number }
    return typeof s?.email === 'string' && !!s.email
  } catch {
    return false
  }
}

export function Protected(props: { children: ReactElement }) {
  const location = useLocation()
  if (!hasSession()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return props.children
}
