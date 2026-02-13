export type PersonMediaType = "movie" | "tv"

export type PersonCreditBase = {
  adult: boolean
  backdrop_path: string | null
  id: number
  original_language: string
  overview: string
  popularity: number
  poster_path: string | null
  vote_average: number
  vote_count: number
  credit_id: string
}

export type PersonCastCredit = PersonCreditBase & {
  media_type?: PersonMediaType
  genre_ids: number[]
  title?: string
  original_title?: string
  release_date?: string
  name?: string
  original_name?: string
  first_air_date?: string
  character: string
  order?: number
  video?: boolean
  origin_country?: string[]
  episode_count?: number
}

export type PersonCrewCredit = PersonCreditBase & {
  media_type?: PersonMediaType
  genre_ids: number[]
  title?: string
  original_title?: string
  release_date?: string
  name?: string
  original_name?: string
  department: string
  job: string
  video?: boolean
  origin_country?: string[]
  first_air_date?: string
  episode_count?: number
}

export type PersonCombinedCreditsResponse = {
  cast: PersonCastCredit[]
  crew: PersonCrewCredit[]
  id: number
}

export type PersonMovieCreditsResponse = {
  cast: PersonCastCredit[]
  crew: PersonCrewCredit[]
  id: number
}

export type PersonTvCreditsResponse = {
  cast: PersonCastCredit[]
  crew: PersonCrewCredit[]
  id: number
}
