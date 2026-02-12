import { type MovieReview } from "@/features/movies/types/movie-reviews"
import { MovieSectionTitle } from "@/features/movies/components/movie-section-title"

type MovieDetailsReviewsProps = {
  movieId: number
  reviews: MovieReview[]
  totalResults: number
}

function getReviewAuthor(review: MovieReview) {
  return review.author_details.name || review.author_details.username || review.author
}

function formatReviewDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date)
}

export function MovieDetailsReviews({
  movieId,
  reviews,
  totalResults,
}: MovieDetailsReviewsProps) {
  const visibleReviews = reviews.slice(0, 3)

  return (
    <section id="reviews" className="scroll-mt-32 py-2">
      <MovieSectionTitle
        title="Reviews"
        count={totalResults}
        href={`/movies/${movieId}/reviews`}
      />

      {visibleReviews.length ? (
        <div className="mt-4 space-y-3">
          {visibleReviews.map((review) => (
            <article key={review.id} className="rounded-lg bg-black/25 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">{getReviewAuthor(review)}</p>
                <p className="text-xs text-slate-400">{formatReviewDate(review.created_at)}</p>
              </div>
              {typeof review.author_details.rating === "number" && (
                <p className="mt-1 text-xs text-primary">
                  Rating: {review.author_details.rating.toFixed(1)} / 10
                </p>
              )}
              <p className="mt-2 line-clamp-4 whitespace-pre-line text-sm text-slate-200/90">
                {review.content}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-300/80">No reviews available for this movie.</p>
      )}
    </section>
  )
}
