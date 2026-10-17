'use client'

import { useState, useEffect } from 'react'
import { getMovieById, MovieDetail, posterOrFallback } from '@/lib/omdb'

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY ?? ''

interface Props {
  imdbID: string
  onClose: () => void
}

export default function MovieModal({ imdbID, onClose }: Props) {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Pide el detalle completo cada vez que cambia la película seleccionada
  useEffect(() => {
    let cancelled = false
    const fetchDetail = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getMovieById(API_KEY, imdbID)
        if (cancelled) return
        if (data.Response === 'False') setError(data.Error ?? 'No se encontró el detalle')
        else setMovie(data)
      } catch {
        if (!cancelled) setError('Error de conexión con OMDb')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchDetail()
    return () => { cancelled = true }
  }, [imdbID])

  // Cerrar con la tecla Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 text-white shadow-2xl ring-1 ring-amber-400/40"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-amber-400 hover:text-black font-bold transition"
        >
          ✕
        </button>

        {loading ? (
          <div className="py-24 text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-amber-400 mx-auto"></div>
            <p className="mt-4 text-slate-400">Cargando detalle...</p>
          </div>
        ) : error ? (
          <p className="py-24 text-center text-red-400">{error}</p>
        ) : movie ? (
          <div className="grid md:grid-cols-[280px_1fr] gap-6 p-6">
            <img
              src={posterOrFallback(movie.Poster)}
              alt={movie.Title}
              onError={(e) => { e.currentTarget.src = '/no-poster.svg' }}
              className="w-full rounded-xl shadow-lg"
            />
            <div>
              <h2 className="text-3xl font-bold text-amber-300">{movie.Title}</h2>
              <p className="text-slate-400 mt-1">
                {movie.Year} · {movie.Rated} · {movie.Runtime}
                {movie.totalSeasons ? ` · ${movie.totalSeasons} temporadas` : ''}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {movie.Genre.split(', ').map((g) => (
                  <span key={g} className="px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 text-sm font-semibold">
                    {g}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-slate-200 leading-relaxed">{movie.Plot}</p>

              <dl className="mt-4 grid grid-cols-[110px_1fr] gap-y-1 text-sm">
                <dt className="text-slate-400">Director</dt><dd>{movie.Director}</dd>
                <dt className="text-slate-400">Guion</dt><dd>{movie.Writer}</dd>
                <dt className="text-slate-400">Actores</dt><dd>{movie.Actors}</dd>
                <dt className="text-slate-400">Estreno</dt><dd>{movie.Released}</dd>
                <dt className="text-slate-400">Idioma</dt><dd>{movie.Language}</dd>
                <dt className="text-slate-400">País</dt><dd>{movie.Country}</dd>
                <dt className="text-slate-400">Premios</dt><dd>{movie.Awards}</dd>
                {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                  <><dt className="text-slate-400">Taquilla</dt><dd>{movie.BoxOffice}</dd></>
                )}
              </dl>

              <div className="flex flex-wrap gap-3 mt-5">
                <div className="px-4 py-2 rounded-lg bg-amber-400 text-black font-bold">
                  ⭐ IMDb {movie.imdbRating}
                  <span className="block text-xs font-normal">{movie.imdbVotes} votos</span>
                </div>
                {movie.Ratings.filter((r) => r.Source !== 'Internet Movie Database').map((r) => (
                  <div key={r.Source} className="px-4 py-2 rounded-lg bg-slate-800 ring-1 ring-white/10">
                    <span className="font-bold">{r.Value}</span>
                    <span className="block text-xs text-slate-400">{r.Source}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
