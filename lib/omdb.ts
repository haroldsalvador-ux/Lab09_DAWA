import axios from 'axios'

export const OMDB_URL = 'https://www.omdbapi.com/'

// Resultado resumido que devuelve la búsqueda general (?s=)
export interface MovieSummary {
  imdbID: string
  Title: string
  Year: string
  Type: 'movie' | 'series' | 'episode' | string
  Poster: string
}

export interface SearchResponse {
  Search?: MovieSummary[]
  totalResults?: string
  Response: 'True' | 'False'
  Error?: string
}

// Información completa que devuelve la búsqueda por Id (?i=)
export interface MovieDetail extends MovieSummary {
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
  Ratings: Array<{ Source: string; Value: string }>
  Metascore: string
  imdbRating: string
  imdbVotes: string
  totalSeasons?: string
  BoxOffice?: string
  Response: 'True' | 'False'
  Error?: string
}

export async function searchMovies(apiKey: string, query: string, type = '', year = '', page = 1) {
  const response = await axios.get<SearchResponse>(OMDB_URL, {
    params: { apikey: apiKey, s: query, type: type || undefined, y: year || undefined, page },
  })
  return response.data
}

export async function getMovieById(apiKey: string, imdbID: string) {
  const response = await axios.get<MovieDetail>(OMDB_URL, {
    params: { apikey: apiKey, i: imdbID, plot: 'full' },
  })
  return response.data
}

export function posterOrFallback(poster: string) {
  return poster && poster !== 'N/A' ? poster : '/no-poster.svg'
}
