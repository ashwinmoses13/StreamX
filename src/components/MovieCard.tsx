import type { OmdbSearchItem } from '../api/omdb'

export function MovieCard(props: { item: OmdbSearchItem; onSelect: (id: string) => void }) {
  const { item } = props
  const hasPoster = item.Poster && item.Poster !== 'N/A'

  return (
    <button className="card" type="button" onClick={() => props.onSelect(item.imdbID)} aria-label={item.Title}>
      {hasPoster ? (
        <img className="card__img" src={item.Poster} alt={item.Title} loading="lazy" />
      ) : (
        <div className="card__fallback">{item.Title}</div>
      )}
      <div className="card__overlay">
        <p className="card__title">{item.Title}</p>
      </div>
    </button>
  )
}

