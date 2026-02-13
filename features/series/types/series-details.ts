export type SeriesGenre = {
  id: number
  name: string
}

export type ProductionCompany = {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export type ProductionCountry = {
  iso_3166_1: string
  name: string
}

export type SpokenLanguage = {
  english_name: string
  iso_639_1: string
  name: string
}

export type Network = {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export type SeriesSeason = {
  id: number
  air_date: string
  episode_count: number
  name: string
  overview: string
  poster_path: string | null
  season_number: number
  vote_average: number
}

export type SeriesDetails = {
  adult: boolean
  backdrop_path: string | null
  created_by: Array<{
    id: number
    name: string
    profile_path: string | null
  }>
  episode_run_time: number[]
  first_air_date: string
  genres: SeriesGenre[]
  homepage: string | null
  id: number
  in_production: boolean
  languages: string[]
  last_air_date: string
  name: string
  number_of_episodes: number
  number_of_seasons: number
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string | null
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  seasons: SeriesSeason[]
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string
  type: string
  vote_average: number
  vote_count: number
  networks: Network[]
}
