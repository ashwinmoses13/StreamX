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

function saveUsers(users: User[]) {
  localStorage.setItem('users', JSON.stringify(users))
}

export default function Register() {
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
    if (users.some((u) => u.email === trimmedEmail)) {
      setError('This email is already registered')
      return
    }
    const next = [...users, { email: trimmedEmail, password: trimmedPassword }]
    saveUsers(next)
    setNotice('Account created successfully')
    setTimeout(() => navigate('/login'), 1000)
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
        <h1 className="auth__title">Create your account</h1>
        <p className="auth__subtitle">Unlimited movies, TV shows, and more.</p>

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
            Sign Up
          </button>
          <p className="auth__hint">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </main>
      {notice ? <div className="toast toast--success">{notice}</div> : null}
    </div>
  )
}
