import { useEffect, useMemo, useRef, useState } from 'react'
import { searchMovies, type OmdbSearchItem } from '../api/omdb'
import type { RowConfig } from '../data/rows'
import { MovieCard } from './MovieCard'

type RowState =
  | { status: 'idle' | 'loading'; items: OmdbSearchItem[]; error: null }
  | { status: 'ready'; items: OmdbSearchItem[]; error: null }
  | { status: 'error'; items: OmdbSearchItem[]; error: string }

export function Row(props: { config: RowConfig; filter: string; onSelect: (imdbID: string) => void }) {
  const [state, setState] = useState<RowState>({ status: 'idle', items: [], error: null })
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    queueMicrotask(() => setState({ status: 'loading', items: [], error: null }))
    searchMovies(props.config.query, { type: props.config.type, signal: controller.signal })
      .then((r) => {
        if (r.error) setState({ status: 'error', items: [], error: r.error })
        else setState({ status: 'ready', items: r.items, error: null })
      })
      .catch((e) => {
        if (controller.signal.aborted) return
        const msg = e instanceof Error ? e.message : 'Failed to load'
        setState({ status: 'error', items: [], error: msg })
      })
    return () => controller.abort()
  }, [props.config.query, props.config.type])

  const visible = useMemo(() => {
    const q = props.filter.trim().toLowerCase()
    if (!q) return state.items
    return state.items.filter((m) => m.Title.toLowerCase().includes(q))
  }, [props.filter, state.items])

  const subtle =
    state.status === 'loading'
      ? 'Loading…'
      : state.status === 'error'
        ? state.error
        : visible.length
          ? `${visible.length} titles`
          : props.filter.trim()
            ? 'No matches'
            : 'No titles'

  const scrollByCards = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.max(260, Math.floor(el.clientWidth * 0.86))
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return (
    <section className="row" aria-label={props.config.title}>
      <header className="row__header">
        <h3 className="row__title">{props.config.title}</h3>
        <span className="row__subtle">{subtle}</span>
      </header>

      <div className="row__viewport">
        <button className="row__btn left" type="button" aria-label="Scroll left" onClick={() => scrollByCards(-1)}>
          ‹
        </button>
        <div className="row__scroller" ref={scrollerRef} role="list">
          {visible.map((item) => (
            <MovieCard key={item.imdbID} item={item} onSelect={props.onSelect} />
          ))}
        </div>
        <button className="row__btn right" type="button" aria-label="Scroll right" onClick={() => scrollByCards(1)}>
          ›
        </button>
      </div>
    </section>
  )
}

