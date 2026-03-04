import { useEffect, useMemo, useState } from 'react'
import { searchMovies, type OmdbSearchItem } from '../api/omdb'

type Tile = { src: string; alt: string; t: string }

function randomTransform(i: number) {
  const r = (seed: number) => {
    const x = Math.sin(seed * 9999) * 10000
    return x - Math.floor(x)
  }
  const rot = (r(i) * 8 - 4).toFixed(2)
  const sx = (1 + r(i + 1) * 0.08).toFixed(3)
  const sy = (1 + r(i + 2) * 0.08).toFixed(3)
  const tx = (r(i + 3) * 8 - 4).toFixed(1)
  const ty = (r(i + 4) * 6 - 3).toFixed(1)
  return `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${sx}, ${sy})`
}

export function AuthBackground() {
  const [items, setItems] = useState<OmdbSearchItem[]>([])

  useEffect(() => {
    const controller = new AbortController()
    async function run() {
      const queries = ['avengers', 'batman', 'mission', 'star', 'comedy', 'thriller', 'breaking']
      const batches = await Promise.all(
        queries.map((q) => searchMovies(q, { type: 'movie', signal: controller.signal })),
      )
      const merged = batches.flatMap((b) => b.items)
      const posters = merged.filter((m) => m.Poster && m.Poster !== 'N/A')
      const unique = new Map<string, OmdbSearchItem>()
      for (const m of posters) if (!unique.has(m.Poster)) unique.set(m.Poster, m)
      const picked = Array.from(unique.values()).slice(0, 40)
      setItems(picked)
    }
    run().catch(() => {})
    return () => controller.abort()
  }, [])

  const tiles = useMemo<Tile[]>(() => {
    return items.map((m, i) => ({ src: m.Poster, alt: m.Title, t: randomTransform(i) }))
  }, [items])

  return (
    <div className="auth__bg" aria-hidden="true">
      <div className="auth__bg__grid">
        {tiles.map((t, i) => (
          <div className="auth__tile" style={{ transform: t.t }} key={t.src + i}>
            <img src={t.src} alt={t.alt} loading="lazy" />
          </div>
        ))}
      </div>
      <div className="auth__bg__overlay" />
    </div>
  )
}

