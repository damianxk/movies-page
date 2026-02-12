export type MovieGenre = {
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

export type CollectionSummary = {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
}

export type MovieDetails = {
  adult: boolean
  backdrop_path: string | null
  belongs_to_collection: CollectionSummary | null
  budget: number
  genres: MovieGenre[]
  homepage: string | null
  id: number
  imdb_id: string | null
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string | null
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  release_date: string
  revenue: number
  runtime: number | null
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}
