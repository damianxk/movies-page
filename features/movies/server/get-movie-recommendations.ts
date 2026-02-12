import { type Movie } from "@/types/movie"

const ONE_HOUR_IN_SECONDS = 3600

type RecommendationsResponse = {
  results?: Movie[]
}

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function getMovieRecommendationsUrl(movieId: number) {
  return `https://api.themoviedb.org/3/movie/${movieId}/recommendations?language=en-US&page=1`
}

export async function getMovieRecommendations(movieId: number): Promise<Movie[]> {
  if (!Number.isFinite(movieId) || movieId <= 0) {
    return []
  }

  const token = getTmdbToken()
  if (!token) {
    return []
  }

  const response = await fetch(getMovieRecommendationsUrl(movieId), {
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

  const data: RecommendationsResponse = await response.json()
  return data.results ?? []
}
