export type SeriesVideo = {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export type SeriesVideosResponse = {
  results: SeriesVideo[]
}
