import {
  type SeriesCastMember,
  type SeriesCrewMember,
  type SeriesCreditsResponse,
} from "@/features/series/types/series-credits"

const ONE_HOUR_IN_SECONDS = 3600

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function getSeriesCreditsUrl(seriesId: number) {
  return `https://api.themoviedb.org/3/tv/${seriesId}/credits?language=en-US`
}

type SeriesCreditsResult = {
  cast: SeriesCastMember[]
  crew: SeriesCrewMember[]
}

export async function getSeriesCredits(seriesId: number): Promise<SeriesCreditsResult> {
  if (!Number.isFinite(seriesId) || seriesId <= 0) {
    return { cast: [], crew: [] }
  }

  const token = getTmdbToken()
  if (!token) {
    return { cast: [], crew: [] }
  }

  const response = await fetch(getSeriesCreditsUrl(seriesId), {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    next: {
      revalidate: ONE_HOUR_IN_SECONDS,
    },
  })

  if (!response.ok) {
    return { cast: [], crew: [] }
  }

  const data = (await response.json()) as SeriesCreditsResponse
  return {
    cast: data.cast ?? [],
    crew: data.crew ?? [],
  }
}
