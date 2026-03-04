import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthBackground } from '../components/AuthBackground'

type User = { email: string; password: string }

function getUsers(): User[] {
  try {
    const raw = localStorage.getItem('users')
    if (!raw) return []
    return JSON.parse(raw) as User[]
  } catch {
    return []
  }
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const navigate = useNavigate()

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedPassword = password.trim()
    if (!trimmedEmail || !trimmedPassword) {
      setError('Please enter email and password')
      return
    }
    const users = getUsers()
    const found = users.find((u) => u.email === trimmedEmail && u.password === trimmedPassword)
    if (!found) {
      setError('Incorrect email or password')
      return
    }
    localStorage.setItem('session', JSON.stringify({ email: found.email, at: Date.now() }))
    setNotice('Login successfully')
    setTimeout(() => navigate('/'), 1000)
  }

  return (
    <div className="auth">
      <AuthBackground />
      <nav className="nav">
        <a className="nav__logo" href="/" aria-label="Home">
          STREAMX
        </a>
        <div className="nav__spacer" />
      </nav>

      <main className="auth__container">
        <h1 className="auth__title">Sign In</h1>
        <p className="auth__subtitle">Welcome back! Watch anywhere.</p>

        <form className="auth__form" onSubmit={onSubmit}>
          <label className="auth__label">
            Email
            <input
              className="auth__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="auth__label">
            Password
            <input
              className="auth__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          {error ? <div className="auth__error">Error: {error}</div> : null}
          <button className="auth__btn" type="submit">
            Sign In
          </button>
          <p className="auth__hint">
            New to STREAMX? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </main>
      {notice ? <div className="toast toast--success">{notice}</div> : null}
    </div>
  )
}
