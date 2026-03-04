import { useEffect, useMemo, useState } from 'react'
import { getMovieDetails, searchMovies, type OmdbMovieDetails } from '../api/omdb'
import { FEATURED_QUERY } from '../data/rows'

type HeroState =
  | { status: 'loading'; movie: null; error: null }
  | { status: 'ready'; movie: OmdbMovieDetails; error: null }
  | { status: 'error'; movie: null; error: string }

export function Hero(props: { onInfo: (imdbID: string) => void }) {
  const [state, setState] = useState<HeroState>({ status: 'loading', movie: null, error: null })

  useEffect(() => {
    const controller = new AbortController()
    queueMicrotask(() => setState({ status: 'loading', movie: null, error: null }))

    async function run() {
      const r = await searchMovies(FEATURED_QUERY.query, { type: FEATURED_QUERY.type, signal: controller.signal })
      const first = (r.items ?? []).find((m) => m.Poster && m.Poster !== 'N/A') ?? r.items?.[0]
      if (!first) throw new Error('No featured title found')
      const details = await getMovieDetails(first.imdbID, { plot: 'full', signal: controller.signal })
      setState({ status: 'ready', movie: details, error: null })
    }

    run().catch((e) => {
      if (controller.signal.aborted) return
      const msg = e instanceof Error ? e.message : 'Failed to load hero'
      setState({ status: 'error', movie: null, error: msg })
    })

    return () => controller.abort()
  }, [])

  const bg = useMemo(() => {
    if (state.status !== 'ready') return ''
    const poster = state.movie.Poster
    if (!poster || poster === 'N/A') return ''
    return `url("${poster}")`
  }, [state])

  const title = state.status === 'ready' ? state.movie.Title : 'Loading…'
  const plot = state.status === 'ready' ? state.movie.Plot : 'Fetching featured title from OMDb…'
  const meta = state.status === 'ready' ? state.movie : null

  return (
    <header id="top" className="hero">
      <div className="hero__bg" style={bg ? { backgroundImage: bg } : undefined} />
      <div className="hero__content">
        <p className="hero__kicker">Featured</p>
        <h1 className="hero__title">{title}</h1>

        {meta ? (
          <div className="hero__meta">
            <span className="pill">{meta.Year}</span>
            {meta.Runtime && meta.Runtime !== 'N/A' ? <span className="pill">{meta.Runtime}</span> : null}
            {meta.Genre && meta.Genre !== 'N/A' ? <span className="pill">{meta.Genre}</span> : null}
            {meta.imdbRating && meta.imdbRating !== 'N/A' ? <span className="pill">IMDb {meta.imdbRating}</span> : null}
          </div>
        ) : state.status === 'error' ? (
          <div className="hero__meta">
            <span className="pill">Error: {state.error}</span>
          </div>
        ) : null}

        <p className="hero__plot">{plot && plot !== 'N/A' ? plot : 'No description available.'}</p>

        <div className="hero__cta">
          <button
            className="btn btn--play"
            type="button"
            onClick={() => {
              if (state.status === 'ready') props.onInfo(state.movie.imdbID)
            }}
            disabled={state.status !== 'ready'}
          >
            ▶ Play
          </button>
          <button
            className="btn btn--info"
            type="button"
            onClick={() => {
              if (state.status === 'ready') props.onInfo(state.movie.imdbID)
            }}
            disabled={state.status !== 'ready'}
          >
            ⓘ More Info
          </button>
        </div>
      </div>
    </header>
  )
}

