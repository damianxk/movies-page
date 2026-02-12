import Image from "next/image"
import { type MovieDetails } from "@/features/movies/types/movie-details"
import {
  calculateStarRating,
  getMoviePosterUrl,
  getReleaseYear,
} from "@/lib/movie-utils"

type MovieDetailsHeroProps = {
  movie: MovieDetails
}

export function MovieDetailsHero({ movie }: MovieDetailsHeroProps) {
  const stars = Math.round(calculateStarRating(movie.vote_average))

  return (
    <section className="relative">
      <div className="grid items-end gap-5 md:grid-cols-[220px_1fr] lg:gap-8">
        <div className="relative mx-auto h-[320px] w-[220px] overflow-hidden rounded-xl border border-white/15 shadow-2xl md:mx-0">
          <Image
            src={getMoviePosterUrl(movie.poster_path, "w500")}
            alt={movie.title}
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
            {movie.original_title || "Movie"}
          </p>
          <h1 className="mt-2 text-3xl font-black italic tracking-tight sm:text-4xl md:text-5xl">
            {movie.title}
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
              {movie.vote_average.toFixed(1)}/10 ({movie.vote_count.toLocaleString("en-US")} votes)
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {movie.genres.slice(0, 3).map((genre) => (
              <span
                key={genre.id}
                className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-cyan-200"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-300">
            <span>{getReleaseYear(movie.release_date).replace("Release ", "")}</span>
            <span>{movie.production_countries[0]?.iso_3166_1 || "N/A"}</span>
            <span>{movie.runtime ? `${movie.runtime} min` : "Runtime N/A"}</span>
          </div>

          <p className="mt-4 text-sm text-cyan-100/90">{movie.tagline || "No tagline available."}</p>
          <p className="mt-3 max-w-3xl text-sm text-slate-300/90 sm:text-base">
            {movie.overview || "No overview available."}
          </p>
        </div>
      </div>
    </section>
  )
}
