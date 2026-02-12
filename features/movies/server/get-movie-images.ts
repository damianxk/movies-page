import {
  type MovieBackdropImage,
  type MovieImagesResponse,
} from "@/features/movies/types/movie-images"

const ONE_HOUR_IN_SECONDS = 3600

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function getMovieImagesUrl(movieId: number) {
  return `https://api.themoviedb.org/3/movie/${movieId}/images`
}

export async function getMovieImages(movieId: number): Promise<MovieBackdropImage[]> {
  if (!Number.isFinite(movieId) || movieId <= 0) {
    return []
  }

  const token = getTmdbToken()
  if (!token) {
    return []
  }

  const response = await fetch(getMovieImagesUrl(movieId), {
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

  const data = (await response.json()) as MovieImagesResponse
  return data.backdrops ?? []
}
