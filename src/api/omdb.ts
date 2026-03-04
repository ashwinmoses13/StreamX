export type OmdbSearchItem = {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export type OmdbSearchResponse = {
  Search?: OmdbSearchItem[]
  totalResults?: string
  Response: 'True' | 'False'
  Error?: string
}

export type OmdbMovieDetails = {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: { Source: string; Value: string }[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: 'True' | 'False'
  Error?: string
}

function getOmdbApiKey() {
  return (import.meta.env.VITE_OMDB_API_KEY as string | undefined) ?? '9a8eb4ca'
}

function omdbUrl(params: Record<string, string>) {
  const url = new URL('https://www.omdbapi.com/')
  url.searchParams.set('apikey', getOmdbApiKey())
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  return url.toString()
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (await res.json()) as T
}

export async function searchMovies(
  query: string,
  options?: { page?: number; type?: 'movie' | 'series'; signal?: AbortSignal },
) {
  const page = options?.page ?? 1
  const url = omdbUrl({
    s: query,
    page: String(page),
    ...(options?.type ? { type: options.type } : {}),
  })

  const data = await fetchJson<OmdbSearchResponse>(url, options?.signal)
  if (data.Response === 'False') return { items: [] as OmdbSearchItem[], error: data.Error ?? 'No results' }
  return { items: data.Search ?? [], error: null as string | null }
}

export async function getMovieDetails(imdbID: string, options?: { plot?: 'short' | 'full'; signal?: AbortSignal }) {
  const url = omdbUrl({ i: imdbID, plot: options?.plot ?? 'full' })
  const data = await fetchJson<OmdbMovieDetails>(url, options?.signal)
  if (data.Response === 'False') throw new Error(data.Error ?? 'Failed to load details')
  return data
}

