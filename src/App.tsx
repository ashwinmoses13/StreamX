import { useState } from 'react'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { MovieModal } from './components/MovieModal'
import { Navbar } from './components/Navbar'
import { Row } from './components/Row'
import { ROWS } from './data/rows'

export default function App() {
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="app">
      <Navbar onSearch={setFilter} />

      <div className="page">
        <Hero onInfo={(id) => setSelected(id)} />

        <main id="rows" className="rows">
          {filter.trim() ? (
            <div className="state">
              Filtering by <b>{filter.trim()}</b>
            </div>
          ) : null}

          {ROWS.map((config) => (
            <Row key={config.id} config={config} filter={filter} onSelect={(id) => setSelected(id)} />
          ))}
        </main>

        <Footer />
      </div>

      {selected ? <MovieModal imdbID={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  )
}
