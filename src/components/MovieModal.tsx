import { useEffect, useMemo, useState } from 'react'
import { getMovieDetails, type OmdbMovieDetails } from '../api/omdb'

type ModalState =
  | { status: 'loading'; movie: null; error: null }
  | { status: 'ready'; movie: OmdbMovieDetails; error: null }
  | { status: 'error'; movie: null; error: string }

export function MovieModal(props: { imdbID: string; onClose: () => void }) {
  const [state, setState] = useState<ModalState>({ status: 'loading', movie: null, error: null })

  useEffect(() => {
    const controller = new AbortController()
    queueMicrotask(() => setState({ status: 'loading', movie: null, error: null }))
    getMovieDetails(props.imdbID, { plot: 'full', signal: controller.signal })
      .then((movie) => setState({ status: 'ready', movie, error: null }))
      .catch((e) => {
        if (controller.signal.aborted) return
        const msg = e instanceof Error ? e.message : 'Failed to load'
        setState({ status: 'error', movie: null, error: msg })
      })

    return () => controller.abort()
  }, [props.imdbID])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') props.onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [props])

  const movie = state.status === 'ready' ? state.movie : null

  const hasPoster = useMemo(() => !!movie?.Poster && movie.Poster !== 'N/A', [movie])

  return (
    <div
      className="modalOverlay"
      role="dialog"
      aria-modal="true"
      aria-label={movie ? movie.Title : 'Title details'}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) props.onClose()
      }}
    >
      <div className="modal">
        <div className="modal__top">
          <button className="modal__close" type="button" aria-label="Close" onClick={props.onClose}>
            ✕
          </button>

          <div className="modal__poster">
            {hasPoster ? <img src={movie!.Poster} alt={movie!.Title} /> : <div className="card__fallback">No poster</div>}
          </div>

          <div className="modal__body">
            {state.status === 'loading' ? (
              <>
                <h2>Loading…</h2>
                <p>Fetching details from OMDb.</p>
              </>
            ) : state.status === 'error' ? (
              <>
                <h2>Couldn’t load</h2>
                <p>{state.error}</p>
              </>
            ) : (
              <>
                <h2>{movie!.Title}</h2>
                <p>{movie!.Plot && movie!.Plot !== 'N/A' ? movie!.Plot : 'No description available.'}</p>
                <div className="modal__grid">
                  <div>
                    <b>Year:</b> {movie!.Year}
                  </div>
                  <div>
                    <b>Runtime:</b> {movie!.Runtime}
                  </div>
                  <div>
                    <b>Genre:</b> {movie!.Genre}
                  </div>
                  <div>
                    <b>IMDb:</b> {movie!.imdbRating}
                  </div>
                  <div>
                    <b>Cast:</b> {movie!.Actors}
                  </div>
                  <div>
                    <b>Director:</b> {movie!.Director}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

