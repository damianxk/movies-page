export type PopularPersonKnownForItem = {
  id: number
  media_type: "movie" | "tv"
  title?: string
  name?: string
}

export type PopularPerson = {
  adult: boolean
  gender: number
  id: number
  known_for: PopularPersonKnownForItem[]
  known_for_department: string
  name: string
  popularity: number
  profile_path: string | null
}

export type PopularPeopleResponse = {
  page: number
  total_pages: number
  total_results: number
  results: PopularPerson[]
}
