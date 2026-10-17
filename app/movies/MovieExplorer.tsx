'use client'

import { useState, useEffect } from 'react'
import { searchMovies, MovieDetail, MovieSummary } from '@/lib/omdb'
import MovieCard from './MovieCard'
import MovieModal from './MovieModal'

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY ?? ''

interface Props {
  // Lista de populares que ya viene renderizada desde el servidor (SSR)
  popular: MovieDetail[]
  initialQuery: string
  initialSelectedId: string | null
}

export default function MovieExplorer({ popular, initialQuery, initialSelectedId }: Props) {
  const [query, setQuery] = useState(initialQuery)
  const [type, setType] = useState('')
  const [year, setYear] = useState('')
  const [results, setResults] = useState<MovieSummary[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId)

  // Búsqueda en tiempo real: espera 500 ms después de la última tecla (debounce)
  useEffect(() => {
    const term = query.trim()
    if (term.length < 3) return

    let cancelled = false
    const timer = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await searchMovies(API_KEY, term, type, year, 1)
        if (cancelled) return
        if (data.Response === 'True' && data.Search) {
          setResults(data.Search)
          setTotal(Number(data.totalResults ?? 0))
          setPage(1)
        } else {
          setResults([])
          setTotal(0)
          setError(data.Error === 'Movie not found!' ? 'No se encontraron resultados' : data.Error ?? 'Sin resultados')
        }
      } catch {
        if (!cancelled) setError('Error de conexión con OMDb')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 500)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, type, year])

  const loadMore = async () => {
    setLoading(true)
    try {
      const data = await searchMovies(API_KEY, query.trim(), type, year, page + 1)
      if (data.Search) {
        setResults((prev) => [...prev, ...data.Search!])
        setPage(page + 1)
      }
    } finally {
      setLoading(false)
    }
  }

  // Con menos de 3 letras no se muestra ninguna búsqueda anterior
  const searching = query.trim().length >= 3
  const visibleResults = searching ? results : []

  return (
    <>
      {/* ---------- Búsqueda (CSR) ---------- */}
      <section className="bg-slate-900/70 rounded-2xl p-6 ring-1 ring-white/10 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-3 h-3 rounded-full bg-sky-400 animate-pulse"></span>
          <h2 className="text-2xl font-bold text-white">Buscar películas y series</h2>
          <span className="ml-auto text-xs font-bold px-2 py-1 rounded bg-sky-500/20 text-sky-300">CSR</span>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_180px_120px]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribe un título... (ej. marvel, suits, batman)"
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-500 ring-1 ring-white/10 focus:ring-2 focus:ring-amber-400 outline-none"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-3 rounded-lg bg-slate-800 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-amber-400 outline-none"
          >
            <option value="">Todos</option>
            <option value="movie">Películas</option>
            <option value="series">Series</option>
          </select>
          <input
            value={year}
            onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="Año"
            inputMode="numeric"
            className="px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-500 ring-1 ring-white/10 focus:ring-2 focus:ring-amber-400 outline-none"
          />
        </div>

        <p className="text-sm text-slate-400 mt-3 h-5">
          {!searching
            ? 'Escribe al menos 3 letras. Los resultados aparecen sin recargar la página.'
            : loading
              ? 'Buscando...'
              : error
                ? <span className="text-red-400">{error}</span>
                : `${total} resultados para "${query.trim()}"`}
        </p>

        {visibleResults.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
              {visibleResults.map((m) => (
                <MovieCard key={m.imdbID} movie={m} onSelect={setSelectedId} />
              ))}
            </div>
            {results.length < total && (
              <div className="text-center mt-6">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2 rounded-full bg-amber-400 text-black font-bold hover:bg-amber-300 disabled:opacity-50 transition"
                >
                  {loading ? 'Cargando...' : 'Cargar más'}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ---------- Populares (datos obtenidos en el servidor) ---------- */}
      <section className="mt-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
          <h2 className="text-2xl font-bold text-white">Populares</h2>
          <span className="ml-auto text-xs font-bold px-2 py-1 rounded bg-green-500/20 text-green-300">SSR</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {popular.map((m) => (
            <MovieCard key={m.imdbID} movie={m} onSelect={setSelectedId} />
          ))}
        </div>
      </section>

      {/* ---------- Detalle en ventana modal (CSR) ---------- */}
      {selectedId && <MovieModal imdbID={selectedId} onClose={() => setSelectedId(null)} />}
    </>
  )
}
