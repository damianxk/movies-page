import { type MovieDetails } from "@/features/movies/types/movie-details"

const ONE_HOUR_IN_SECONDS = 3600

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function getMovieDetailsUrl(movieId: number) {
  return `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`
}

export async function getMovieDetails(
  movieId: number,
): Promise<MovieDetails | null> {
  if (!Number.isFinite(movieId) || movieId <= 0) {
    return null
  }

  const token = getTmdbToken()
  if (!token) {
    return null
  }

  const response = await fetch(getMovieDetailsUrl(movieId), {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    next: {
      revalidate: ONE_HOUR_IN_SECONDS,
    },
  })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as MovieDetails
  return data
}
