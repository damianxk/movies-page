import { notFound } from "next/navigation"
import { getMovieDetails } from "@/features/movies/server/get-movie-details"
import { getMovieCredits } from "@/features/movies/server/get-movie-credits"
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

  const [movie, cast] = await Promise.all([
    getMovieDetails(parsedMovieId),
    getMovieCredits(parsedMovieId),
  ])

  if (!movie) {
    notFound()
  }

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
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: `url('${getMovieBackdropUrl(movie.backdrop_path)}')` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#030711]/50 via-[#030711]/80 to-[#030711]" />
        <div className="absolute inset-0 bg-linear-to-r from-[#030711]/70 via-transparent to-[#030711]/65" />
      </div>

      <div className="relative z-10 flex min-h-svh w-full flex-col justify-end gap-5 px-4 pb-8 pt-24 sm:px-6 lg:px-12 lg:pb-10">
        <MovieDetailsHero movie={movie} />

        <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
          <MovieDetailsCast cast={cast} />
          <MovieDetailsFacts facts={facts} />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <MovieDetailsBadges title="Genres" items={movie.genres.map((genre) => genre.name)} />
          <MovieDetailsBadges
            title="Spoken languages"
            items={movie.spoken_languages.map((language) => language.english_name)}
          />
          <MovieDetailsBadges
            title="Production countries"
            items={movie.production_countries.map((country) => country.name)}
          />
          <MovieDetailsIdentifiers movie={movie} />
        </div>

        <MovieDetailsCompanies companies={movie.production_companies} />
        <MovieDetailsJson movie={movie} />
      </div>
    </main>
  )
}
