import {
  type CastMember,
  type CrewMember,
  type MovieCreditsResponse,
} from "@/features/movies/types/movie-credits"

const ONE_HOUR_IN_SECONDS = 3600

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function getMovieCreditsUrl(movieId: number) {
  return `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`
}

type MovieCreditsResult = {
  cast: CastMember[]
  crew: CrewMember[]
}

export async function getMovieCredits(movieId: number): Promise<MovieCreditsResult> {
  if (!Number.isFinite(movieId) || movieId <= 0) {
    return { cast: [], crew: [] }
  }

  const token = getTmdbToken()
  if (!token) {
    return { cast: [], crew: [] }
  }

  const response = await fetch(getMovieCreditsUrl(movieId), {
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

  const data = (await response.json()) as MovieCreditsResponse
  return {
    cast: data.cast ?? [],
    crew: data.crew ?? [],
  }
}
