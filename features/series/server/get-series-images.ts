import {
  type SeriesBackdropImage,
  type SeriesImagesResponse,
} from "@/features/series/types/series-images"

const ONE_HOUR_IN_SECONDS = 3600

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function getSeriesImagesUrl(seriesId: number) {
  return `https://api.themoviedb.org/3/tv/${seriesId}/images`
}

export async function getSeriesImages(seriesId: number): Promise<SeriesBackdropImage[]> {
  if (!Number.isFinite(seriesId) || seriesId <= 0) {
    return []
  }

  const token = getTmdbToken()
  if (!token) {
    return []
  }

  const response = await fetch(getSeriesImagesUrl(seriesId), {
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

  const data = (await response.json()) as SeriesImagesResponse
  return data.backdrops ?? []
}
