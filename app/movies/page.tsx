import { connection } from 'next/server'
import { getMovieById, MovieDetail } from '@/lib/omdb'
import MovieExplorer from './MovieExplorer'

// SSR clásico: el servidor espera los datos antes de enviar el HTML
export const instant = false

// OMDb no tiene endpoint de "populares", así que usamos una selección de títulos conocidos
const POPULAR_IDS = [
  'tt0111161', // The Shawshank Redemption
  'tt0468569', // The Dark Knight
  'tt1375666', // Inception
  'tt0816692', // Interstellar
  'tt4154796', // Avengers: Endgame
  'tt0133093', // The Matrix
  'tt0903747', // Breaking Bad
  'tt0944947', // Game of Thrones
  'tt1632701', // Suits
  'tt4574334', // Stranger Things
  'tt0110912', // Pulp Fiction
  'tt2442560', // Peaky Blinders
]

async function getPopularMovies(): Promise<MovieDetail[]> {
  // Next.js 16: renderizar en cada petición (SSR dinámico)
  await connection()
  const apiKey = process.env.OMDB_API_KEY ?? ''
  // Las 12 peticiones se hacen en paralelo en el servidor
  const movies = await Promise.all(POPULAR_IDS.map((id) => getMovieById(apiKey, id)))
  return movies.filter((m) => m.Response === 'True')
}

export const metadata = {
  title: 'Galería de Películas y Series',
  description: 'Películas populares (SSR) y búsqueda en tiempo real (CSR) con la API de OMDb',
}

export default async function MoviesPage() {
  const popular = await getPopularMovies()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            🎬 Galería de <span className="text-amber-400">Películas</span> y Series
          </h1>
          <p className="text-slate-400 mt-3">
            Populares renderizadas en el servidor · Búsqueda en tiempo real en el navegador · Datos de OMDb
          </p>
        </header>

        <MovieExplorer popular={popular} />

        <footer className="mt-12 text-center text-sm text-slate-500">
          Laboratorio 09 · Next.js · CSR y SSR
        </footer>
      </div>
    </div>
  )
}
