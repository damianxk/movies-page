import {
  type SeriesVideo,
  type SeriesVideosResponse,
} from "@/features/series/types/series-videos"

const ONE_HOUR_IN_SECONDS = 3600

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function getSeriesVideosUrl(seriesId: number) {
  return `https://api.themoviedb.org/3/tv/${seriesId}/videos?language=en-US`
}

export async function getSeriesVideos(seriesId: number): Promise<SeriesVideo[]> {
  if (!Number.isFinite(seriesId) || seriesId <= 0) {
    return []
  }

  const token = getTmdbToken()
  if (!token) {
    return []
  }

  const response = await fetch(getSeriesVideosUrl(seriesId), {
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

  const data = (await response.json()) as SeriesVideosResponse
  return data.results ?? []
}
