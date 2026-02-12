import { notFound } from "next/navigation"
import { getMovieDetails } from "@/features/movies/server/get-movie-details"
import { getMovieCredits } from "@/features/movies/server/get-movie-credits"
import { getMovieVideos } from "@/features/movies/server/get-movie-videos"
import { getMovieRecommendations } from "@/features/movies/server/get-movie-recommendations"
import { getMovieImages } from "@/features/movies/server/get-movie-images"
import { getMovieBackdropUrl } from "@/lib/movie-utils"
import {
  formatBoolean,
  formatDate,
  formatMoney,
  formatRuntime,
} from "@/features/movies/lib/movie-details-formatters"
import { MovieDetailsHero } from "@/features/movies/components/movie-details-hero"
import { MovieDetailsFacts } from "@/features/movies/components/movie-details-facts"
import { MovieDetailsBadges } from "@/features/movies/components/movie-details-badges"
import { MovieDetailsCompanies } from "@/features/movies/components/movie-details-companies"
import { MovieDetailsIdentifiers } from "@/features/movies/components/movie-details-identifiers"
import { MovieDetailsJson } from "@/features/movies/components/movie-details-json"
import { MovieDetailsCast } from "@/features/movies/components/movie-details-cast"
import { MovieDetailsCrew } from "@/features/movies/components/movie-details-crew"
import { MovieDetailsMedia } from "@/features/movies/components/movie-details-media"
import { MovieDetailsImages } from "@/features/movies/components/movie-details-images"
import { MovieDetailsRecommendations } from "@/features/movies/components/movie-details-recommendations"

type MovieDetailsPageProps = {
  params: Promise<{ movieId: string }>
}

function toMovieId(value: string) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) return null
  return parsed
}

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const { movieId } = await params
  const parsedMovieId = toMovieId(movieId)
  if (!parsedMovieId) {
    notFound()
  }

  const [movie, credits, videos, images, recommendations] = await Promise.all([
    getMovieDetails(parsedMovieId),
    getMovieCredits(parsedMovieId),
    getMovieVideos(parsedMovieId),
    getMovieImages(parsedMovieId),
    getMovieRecommendations(parsedMovieId),
  ])

  if (!movie) {
    notFound()
  }

  const safeCast = Array.isArray(credits?.cast) ? credits.cast : []
  const safeCrew = Array.isArray(credits?.crew) ? credits.crew : []

  const facts = [
    { label: "Adult", value: formatBoolean(movie.adult) },
    { label: "Video", value: formatBoolean(movie.video) },
    { label: "Status", value: movie.status || "Unknown" },
    { label: "Release date", value: formatDate(movie.release_date) },
    { label: "Runtime", value: formatRuntime(movie.runtime) },
    { label: "Original language", value: movie.original_language.toUpperCase() },
    { label: "Popularity", value: movie.popularity.toFixed(3) },
    { label: "Vote average", value: movie.vote_average.toFixed(3) },
    { label: "Vote count", value: movie.vote_count.toLocaleString("en-US") },
    { label: "Budget", value: formatMoney(movie.budget) },
    { label: "Revenue", value: formatMoney(movie.revenue) },
  ]

  return (
    <main className="relative min-h-svh w-full overflow-hidden bg-[#030711]">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: `url('${getMovieBackdropUrl(movie.backdrop_path)}')` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#030711]/50 via-[#030711]/80 to-[#030711]" />
        <div className="absolute inset-0 bg-linear-to-r from-[#030711]/70 via-transparent to-[#030711]/65" />
      </div>

      <div className="relative z-10 flex min-h-svh w-full flex-col gap-4 px-4 pb-6 pt-24 sm:px-6 lg:px-12 lg:pb-8">
        <section id="overview" className="scroll-mt-32">
          <MovieDetailsHero movie={movie} />
        </section>

        {/* <MovieDetailsSectionNav /> */}

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)]">
          <div className="space-y-4">
            <section id="cast" className="scroll-mt-32">
              <MovieDetailsCast movieId={movie.id} cast={safeCast} />
            </section>

            <section id="crew" className="scroll-mt-32">
              <MovieDetailsCrew crew={safeCrew} />
            </section>

            <section id="details" className="scroll-mt-32 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <MovieDetailsBadges title="Genres" items={movie.genres.map((genre) => genre.name)} />
                <MovieDetailsBadges
                  title="Spoken languages"
                  items={movie.spoken_languages.map((language) => language.english_name)}
                />
              </div>

              <MovieDetailsBadges
                title="Production countries"
                items={movie.production_countries.map((country) => country.name)}
              />
              <MovieDetailsCompanies companies={movie.production_companies} />
              <MovieDetailsJson movie={movie} />
            </section>
          </div>

          <aside className="space-y-4 xl:pt-1">
            <section id="media" className="scroll-mt-32">
              <MovieDetailsMedia videos={videos} />
            </section>

            <MovieDetailsImages images={images} />

            <section id="recommendations" className="scroll-mt-32">
              <MovieDetailsRecommendations movies={recommendations} />
            </section>

            <MovieDetailsFacts facts={facts} />
            <MovieDetailsIdentifiers movie={movie} />
          </aside>
        </div>
      </div>
    </main>
  )
}
