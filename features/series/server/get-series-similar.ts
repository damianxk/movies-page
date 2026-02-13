import { type Series } from "@/types/series"

const ONE_HOUR_IN_SECONDS = 3600

type SimilarResponse = {
  results?: Series[]
}

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function getSeriesSimilarUrl(seriesId: number) {
  return `https://api.themoviedb.org/3/tv/${seriesId}/similar?language=en-US&page=1`
}

export async function getSeriesSimilar(seriesId: number): Promise<Series[]> {
  if (!Number.isFinite(seriesId) || seriesId <= 0) {
    return []
  }

  const token = getTmdbToken()
  if (!token) {
    return []
  }

  const response = await fetch(getSeriesSimilarUrl(seriesId), {
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

  const data: SimilarResponse = await response.json()
  return data.results ?? []
}
