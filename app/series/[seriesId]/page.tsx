import { notFound } from "next/navigation"
import { getSeriesDetails } from "@/features/series/server/get-series-details"
import { getSeriesCredits } from "@/features/series/server/get-series-credits"
import { getSeriesVideos } from "@/features/series/server/get-series-videos"
import { getSeriesRecommendations } from "@/features/series/server/get-series-recommendations"
import { getSeriesSimilar } from "@/features/series/server/get-series-similar"
import { getSeriesImages } from "@/features/series/server/get-series-images"
import { getSeriesReviews } from "@/features/series/server/get-series-reviews"
import { getMovieBackdropUrl } from "@/lib/movie-utils"
import { formatBoolean, formatDate } from "@/features/movies/lib/movie-details-formatters"
import { SeriesDetailsHero } from "@/features/series/components/series-details-hero"
import { SeriesDetailsFacts } from "@/features/series/components/series-details-facts"
import { MovieDetailsCompanies } from "@/features/movies/components/movie-details-companies"
import { SeriesDetailsIdentifiers } from "@/features/series/components/series-details-identifiers"
import { SeriesDetailsCast } from "@/features/series/components/series-details-cast"
import { MovieDetailsCrew } from "@/features/movies/components/movie-details-crew"
import { MovieDetailsMedia } from "@/features/movies/components/movie-details-media"
import { MovieDetailsImages } from "@/features/movies/components/movie-details-images"
import { SeriesDetailsListCarousel } from "@/features/series/components/series-details-list-carousel"
import { SeriesDetailsReviews } from "@/features/series/components/series-details-reviews"

type SeriesDetailsPageProps = {
  params: Promise<{ seriesId: string }>
}

function toSeriesId(value: string) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) return null
  return parsed
}

function formatEpisodeRuntime(values: number[]) {
  const runtime = values.find((value) => Number.isFinite(value) && value > 0)
  if (!runtime) return "Unknown"
  const hours = Math.floor(runtime / 60)
  const remainingMinutes = runtime % 60
  return `${hours}h ${remainingMinutes}m`
}

export default async function SeriesDetailsPage({ params }: SeriesDetailsPageProps) {
  const { seriesId } = await params
  const parsedSeriesId = toSeriesId(seriesId)
  if (!parsedSeriesId) {
    notFound()
  }

  const [series, credits, videos, images, recommendations, similar, reviewsResponse] = await Promise.all([
    getSeriesDetails(parsedSeriesId),
    getSeriesCredits(parsedSeriesId),
    getSeriesVideos(parsedSeriesId),
    getSeriesImages(parsedSeriesId),
    getSeriesRecommendations(parsedSeriesId),
    getSeriesSimilar(parsedSeriesId),
    getSeriesReviews(parsedSeriesId, 1),
  ])

  if (!series) {
    notFound()
  }

  const safeCast = Array.isArray(credits?.cast) ? credits.cast : []
  const safeCrew = Array.isArray(credits?.crew) ? credits.crew : []

  const facts = [
    { label: "Adult", value: formatBoolean(series.adult) },
    { label: "In production", value: formatBoolean(series.in_production) },
    { label: "Status", value: series.status || "Unknown" },
    { label: "Type", value: series.type || "Unknown" },
    { label: "First air date", value: formatDate(series.first_air_date) },
    { label: "Last air date", value: formatDate(series.last_air_date) },
    { label: "Episode runtime", value: formatEpisodeRuntime(series.episode_run_time) },
    { label: "Original language", value: series.original_language.toUpperCase() },
    { label: "Popularity", value: series.popularity.toFixed(3) },
    { label: "Vote average", value: series.vote_average.toFixed(3) },
    { label: "Vote count", value: series.vote_count.toLocaleString("en-US") },
    { label: "Seasons", value: String(series.number_of_seasons) },
    { label: "Episodes", value: String(series.number_of_episodes) },
  ]

  return (
    <main className="relative min-h-svh w-full overflow-hidden bg-[#030711]">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: `url('${getMovieBackdropUrl(series.backdrop_path)}')` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#030711]/50 via-[#030711]/80 to-[#030711]" />
        <div className="absolute inset-0 bg-linear-to-r from-[#030711]/70 via-transparent to-[#030711]/65" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[1640px] flex-col gap-4 overflow-x-clip px-4 pb-6 pt-24 sm:px-6 lg:px-10 lg:pb-8 xl:px-12">
        <section id="overview" className="scroll-mt-32">
          <SeriesDetailsHero series={series} />
        </section>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)] xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.88fr)]">
          <div className="min-w-0 space-y-5">
            <section id="cast" className="scroll-mt-32">
              <SeriesDetailsCast seriesId={series.id} cast={safeCast} />
            </section>

            <section id="crew" className="scroll-mt-32">
              <MovieDetailsCrew crew={safeCrew} />
            </section>

            <section id="details" className="scroll-mt-32 space-y-5">
              <MovieDetailsCompanies companies={series.production_companies} />
              <SeriesDetailsReviews
                seriesId={series.id}
                reviews={reviewsResponse.reviews}
                totalResults={reviewsResponse.totalResults}
              />
            </section>
          </div>

          <aside className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
            <section id="media" className="scroll-mt-32">
              <MovieDetailsMedia videos={videos} />
            </section>

            <MovieDetailsImages images={images} />

            <section id="recommendations" className="scroll-mt-32">
              <SeriesDetailsListCarousel title="Recommendations" items={recommendations} />
            </section>

            <section id="similar" className="scroll-mt-32">
              <SeriesDetailsListCarousel title="Similar series" items={similar} />
            </section>

            <SeriesDetailsFacts facts={facts} />
            <SeriesDetailsIdentifiers series={series} />
          </aside>
        </div>
      </div>
    </main>
  )
}
