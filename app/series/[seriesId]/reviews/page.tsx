import Link from "next/link"
import { notFound } from "next/navigation"
import { getSeriesDetails } from "@/features/series/server/get-series-details"
import { getSeriesReviews } from "@/features/series/server/get-series-reviews"
import { getMovieBackdropUrl } from "@/lib/movie-utils"

type SeriesReviewsPageProps = {
  params: Promise<{ seriesId: string }>
  searchParams: Promise<{ page?: string }>
}

function toSeriesId(value: string) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) return null
  return parsed
}

function toPage(value?: string) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) return 1
  return parsed
}

function getReviewAuthorName(review: {
  author: string
  author_details: { name: string; username: string }
}) {
  return review.author_details.name || review.author_details.username || review.author
}

function formatReviewDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date)
}

export default async function SeriesReviewsPage({
  params,
  searchParams,
}: SeriesReviewsPageProps) {
  const { seriesId } = await params
  const query = await searchParams
  const parsedSeriesId = toSeriesId(seriesId)

  if (!parsedSeriesId) {
    notFound()
  }

  const page = toPage(query.page)
  const [series, reviewsResponse] = await Promise.all([
    getSeriesDetails(parsedSeriesId),
    getSeriesReviews(parsedSeriesId, page),
  ])

  if (!series) {
    notFound()
  }

  const canGoPrev = reviewsResponse.page > 1
  const canGoNext = reviewsResponse.page < reviewsResponse.totalPages

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030711]">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('${getMovieBackdropUrl(series.backdrop_path)}')` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#030711]/60 via-[#030711]/86 to-[#030711]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-8 pt-24 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300/80">Series reviews</p>
            <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
              {series.name} - Reviews
            </h1>
            <p className="mt-2 text-sm text-slate-300/85">
              Total reviews: {reviewsResponse.totalResults}
            </p>
          </div>
          <Link
            href={`/series/${series.id}`}
            className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
          >
            Back to series
          </Link>
        </div>

        {reviewsResponse.reviews.length ? (
          <div className="space-y-3">
            {reviewsResponse.reviews.map((review) => (
              <article key={review.id} className="rounded-lg bg-black/25 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">
                    {getReviewAuthorName(review)}
                  </p>
                  <p className="text-xs text-slate-400">{formatReviewDate(review.created_at)}</p>
                </div>
                {typeof review.author_details.rating === "number" && (
                  <p className="mt-1 text-xs text-primary">
                    Rating: {review.author_details.rating.toFixed(1)} / 10
                  </p>
                )}
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-200/90">
                  {review.content}
                </p>
                <Link
                  href={review.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-xs text-slate-300 underline-offset-4 hover:underline"
                >
                  View original review
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-300/80">No reviews available for this series.</p>
        )}

        <div className="mt-6 flex items-center justify-between">
          {canGoPrev ? (
            <Link
              href={`/series/${series.id}/reviews?page=${reviewsResponse.page - 1}`}
              className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
            >
              Previous page
            </Link>
          ) : (
            <span />
          )}

          <p className="text-xs text-slate-300/80">
            Page {reviewsResponse.page} of {Math.max(reviewsResponse.totalPages, 1)}
          </p>

          {canGoNext ? (
            <Link
              href={`/series/${series.id}/reviews?page=${reviewsResponse.page + 1}`}
              className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
            >
              Next page
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </main>
  )
}
