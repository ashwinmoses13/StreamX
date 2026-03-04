export type RowConfig = {
  id: string
  title: string
  query: string
  type?: 'movie' | 'series'
}

export const FEATURED_QUERY: RowConfig = {
  id: 'featured',
  title: 'Featured',
  query: 'avengers',
  type: 'movie',
}

export const ROWS: RowConfig[] = [
  { id: 'trending', title: 'Trending Now', query: 'batman' },
  { id: 'top', title: 'Top Picks for You', query: 'avengers', type: 'movie' },
  { id: 'action', title: 'Action & Adventure', query: 'mission', type: 'movie' },
  { id: 'comedy', title: 'Comedies', query: 'comedy', type: 'movie' },
  { id: 'thriller', title: 'Thrillers', query: 'thriller', type: 'movie' },
  { id: 'sci', title: 'Sci‑Fi & Fantasy', query: 'star', type: 'movie' },
  { id: 'tv', title: 'Binge‑worthy TV', query: 'breaking', type: 'series' },
]

