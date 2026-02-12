import { type MovieVideo, type MovieVideosResponse } from "@/features/movies/types/movie-videos"

const ONE_HOUR_IN_SECONDS = 3600

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function getMovieVideosUrl(movieId: number) {
  return `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`
}

export async function getMovieVideos(movieId: number): Promise<MovieVideo[]> {
  if (!Number.isFinite(movieId) || movieId <= 0) {
    return []
  }

  const token = getTmdbToken()
  if (!token) {
    return []
  }

  const response = await fetch(getMovieVideosUrl(movieId), {
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

  const data = (await response.json()) as MovieVideosResponse
  return data.results ?? []
}
