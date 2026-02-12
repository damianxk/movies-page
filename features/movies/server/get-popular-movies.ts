import { type Movie } from "@/types/movie"

const TMDB_POPULAR_MOVIES_URL =
  "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1"
const ONE_HOUR_IN_SECONDS = 3600

type PopularMoviesResponse = {
  results?: Movie[]
}

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

export async function getPopularMovies(): Promise<Movie[]> {
  const token = getTmdbToken()
  if (!token) {
    return []
  }

  const response = await fetch(TMDB_POPULAR_MOVIES_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    next: {
      revalidate: ONE_HOUR_IN_SECONDS,
    },
  })

  if (!response.ok) {
    return []
  }

  const data: PopularMoviesResponse = await response.json()
  return data.results ?? []
}
