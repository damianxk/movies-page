import {
  type MovieReview,
  type MovieReviewsResponse,
} from "@/features/movies/types/movie-reviews"

const ONE_HOUR_IN_SECONDS = 3600

type GetMovieReviewsResult = {
  page: number
  totalPages: number
  totalResults: number
  reviews: MovieReview[]
}

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function getMovieReviewsUrl(movieId: number, page: number) {
  return `https://api.themoviedb.org/3/movie/${movieId}/reviews?page=${page}`
}

export async function getMovieReviews(
  movieId: number,
  page = 1,
): Promise<GetMovieReviewsResult> {
  if (!Number.isFinite(movieId) || movieId <= 0) {
    return { page: 1, totalPages: 0, totalResults: 0, reviews: [] }
  }

  const token = getTmdbToken()
  if (!token) {
    return { page: 1, totalPages: 0, totalResults: 0, reviews: [] }
  }

  const safePage = Number.isInteger(page) && page > 0 ? page : 1
  const response = await fetch(getMovieReviewsUrl(movieId, safePage), {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    next: {
      revalidate: ONE_HOUR_IN_SECONDS,
    },
  })

  if (!response.ok) {
    return { page: safePage, totalPages: 0, totalResults: 0, reviews: [] }
  }

  const data = (await response.json()) as MovieReviewsResponse
  return {
    page: data.page ?? safePage,
    totalPages: data.total_pages ?? 0,
    totalResults: data.total_results ?? 0,
    reviews: data.results ?? [],
  }
}
