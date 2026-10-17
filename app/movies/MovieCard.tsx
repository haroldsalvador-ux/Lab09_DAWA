'use client'

import { MovieSummary, posterOrFallback } from '@/lib/omdb'

interface Props {
  movie: MovieSummary & { imdbRating?: string; Genre?: string }
  onSelect: (imdbID: string) => void
}

// Componente presentacional: se usa tanto en la lista SSR como en la búsqueda CSR
export default function MovieCard({ movie, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(movie.imdbID)}
      className="group text-left bg-slate-800/80 rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10 hover:ring-amber-400 hover:-translate-y-1 transition duration-200"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
        <img
          src={posterOrFallback(movie.Poster)}
          alt={movie.Title}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = '/no-poster.svg' }}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-black/70 text-amber-300">
          {movie.Type === 'series' ? 'Serie' : movie.Type === 'movie' ? 'Película' : movie.Type}
        </span>
        {movie.imdbRating && movie.imdbRating !== 'N/A' && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-black">
            ⭐ {movie.imdbRating}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-white leading-tight line-clamp-2">{movie.Title}</h3>
        <p className="text-sm text-slate-400 mt-1">
          {movie.Year}
          {movie.Genre ? ` · ${movie.Genre.split(',')[0]}` : ''}
        </p>
      </div>
    </button>
  )
}
