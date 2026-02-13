import { type SeriesDetails } from "@/features/series/types/series-details"

const ONE_HOUR_IN_SECONDS = 3600

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function getSeriesDetailsUrl(seriesId: number) {
  return `https://api.themoviedb.org/3/tv/${seriesId}?language=en-US`
}

export async function getSeriesDetails(seriesId: number): Promise<SeriesDetails | null> {
  if (!Number.isFinite(seriesId) || seriesId <= 0) {
    return null
  }

  const token = getTmdbToken()
  if (!token) {
    return null
  }

  const response = await fetch(getSeriesDetailsUrl(seriesId), {
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

  const data = (await response.json()) as SeriesDetails
  return data
}
