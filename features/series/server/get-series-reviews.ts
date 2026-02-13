import {
  type SeriesReview,
  type SeriesReviewsResponse,
} from "@/features/series/types/series-reviews"

const ONE_HOUR_IN_SECONDS = 3600

type GetSeriesReviewsResult = {
  page: number
  totalPages: number
  totalResults: number
  reviews: SeriesReview[]
}

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function getSeriesReviewsUrl(seriesId: number, page: number) {
  return `https://api.themoviedb.org/3/tv/${seriesId}/reviews?page=${page}`
}

export async function getSeriesReviews(
  seriesId: number,
  page = 1,
): Promise<GetSeriesReviewsResult> {
  if (!Number.isFinite(seriesId) || seriesId <= 0) {
    return { page: 1, totalPages: 0, totalResults: 0, reviews: [] }
  }

  const token = getTmdbToken()
  if (!token) {
    return { page: 1, totalPages: 0, totalResults: 0, reviews: [] }
  }

  const safePage = Number.isInteger(page) && page > 0 ? page : 1
  const response = await fetch(getSeriesReviewsUrl(seriesId, safePage), {
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

  const data = (await response.json()) as SeriesReviewsResponse
  return {
    page: data.page ?? safePage,
    totalPages: data.total_pages ?? 0,
    totalResults: data.total_results ?? 0,
    reviews: data.results ?? [],
  }
}
