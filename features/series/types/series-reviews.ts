export type SeriesReviewAuthorDetails = {
  name: string
  username: string
  avatar_path: string | null
  rating: number | null
}

export type SeriesReview = {
  id: string
  author: string
  author_details: SeriesReviewAuthorDetails
  content: string
  created_at: string
  updated_at: string
  url: string
}

export type SeriesReviewsResponse = {
  id: number
  page: number
  results: SeriesReview[]
  total_pages: number
  total_results: number
}
