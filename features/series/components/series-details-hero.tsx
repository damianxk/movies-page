import Image from "next/image"
import { type SeriesDetails } from "@/features/series/types/series-details"
import {
  calculateStarRating,
  getMoviePosterUrl,
  getReleaseYear,
} from "@/lib/movie-utils"

type SeriesDetailsHeroProps = {
  series: SeriesDetails
}

function getRuntimeLabel(values: number[]) {
  const runtime = values.find((value) => Number.isFinite(value) && value > 0)
  if (!runtime) return "Runtime N/A"
  return `${runtime} min`
}

export function SeriesDetailsHero({ series }: SeriesDetailsHeroProps) {
  const stars = Math.round(calculateStarRating(series.vote_average))
  const spokenLanguages = Array.from(
    new Set(series.spoken_languages.map((language) => language.english_name).filter(Boolean)),
  )
  const visibleSpokenLanguages = spokenLanguages.slice(0, 2)
  const hiddenLanguagesCount = Math.max(0, spokenLanguages.length - visibleSpokenLanguages.length)

  return (
    <section className="relative">
      <div className="grid items-end gap-5 md:grid-cols-[220px_1fr] lg:gap-8">
        <div className="relative mx-auto h-[320px] w-[220px] overflow-hidden rounded-xl shadow-2xl md:mx-0">
          <Image
            src={getMoviePosterUrl(series.poster_path, "w500")}
            alt={series.name}
            fill
            sizes="220px"
            className="object-cover"
          />
        </div>

        <div className="relative flex flex-col justify-end text-white">
          <div
            className="pointer-events-none absolute -inset-x-4 -inset-y-6 -z-10 rounded-[2rem] bg-linear-to-t from-black/70 via-black/45 to-transparent blur-2xl"
            aria-hidden="true"
          />
          <p className="text-xs uppercase tracking-[0.24em] text-slate-300/80">
            {series.original_name || "Series"}
          </p>
          <h1 className="mt-2 text-3xl font-black italic tracking-tight sm:text-4xl md:text-5xl">
            {series.name}
          </h1>

          <div className="mt-3 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={`details-star-${index}`}
                className={index < stars ? "text-yellow-400" : "text-slate-500"}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-xs text-slate-300">
              {series.vote_average.toFixed(1)}/10 ({series.vote_count.toLocaleString("en-US")} votes)
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {series.genres.slice(0, 3).map((genre) => (
              <span key={genre.id} className="rounded-full bg-white/10 px-2.5 py-1 text-slate-100">
                {genre.name}
              </span>
            ))}
            {visibleSpokenLanguages.map((language) => (
              <span key={language} className="rounded-full bg-primary/15 px-2.5 py-1 text-primary">
                Lang: {language}
              </span>
            ))}
            {hiddenLanguagesCount > 0 && (
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-primary">
                +{hiddenLanguagesCount} lang
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-300">
            <span>{getReleaseYear(series.first_air_date).replace("Release ", "")}</span>
            <span>{series.origin_country[0] || "N/A"}</span>
            <span>{getRuntimeLabel(series.episode_run_time)}</span>
          </div>

          <p className="mt-4 text-sm text-cyan-100/90">{series.tagline || "No tagline available."}</p>
          <p className="mt-3 max-w-3xl text-sm text-slate-300/90 sm:text-base">
            {series.overview || "No overview available."}
          </p>
        </div>
      </div>
    </section>
  )
}
