export type MovieReviewAuthorDetails = {
  name: string
  username: string
  avatar_path: string | null
  rating: number | null
}

export type MovieReview = {
  id: string
  author: string
  author_details: MovieReviewAuthorDetails
  content: string
  created_at: string
  updated_at: string
  url: string
}

export type MovieReviewsResponse = {
  id: number
  page: number
  results: MovieReview[]
  total_pages: number
  total_results: number
}
