export type SeriesCastMember = {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export type SeriesCrewMember = {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export type SeriesCreditsResponse = {
  cast: SeriesCastMember[]
  crew: SeriesCrewMember[]
}
