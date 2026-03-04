import { useEffect, useMemo, useState } from 'react'

export function Navbar(props: { onSearch: (q: string) => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [q, setQ] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const placeholder = useMemo(() => 'Search titles…', [])

  return (
    <nav className={scrolled ? 'nav scrolled' : 'nav'}>
      <a className="nav__logo" href="#top" aria-label="Home">
        STREAMX
      </a>

      <div className="nav__links" aria-label="Primary">
        <a href="#top">Home</a>
        <a href="#rows">TV Shows</a>
        <a href="#rows">Movies</a>
        <a href="#rows">New &amp; Popular</a>
        <a href="#rows">My List</a>
      </div>

      <div className="nav__spacer" />

      <div className="nav__actions">
        <div className="nav__search" role="search">
          <span aria-hidden="true">⌕</span>
          <input
            value={q}
            onChange={(e) => {
              const next = e.target.value
              setQ(next)
              props.onSearch(next)
            }}
            placeholder={placeholder}
            aria-label="Search movies"
          />
        </div>
        <div className="nav__avatar" aria-label="Profile" />
      </div>
    </nav>
  )
}
