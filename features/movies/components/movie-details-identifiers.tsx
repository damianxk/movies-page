import Link from "next/link"
import { type MovieDetails } from "@/features/movies/types/movie-details"

type MovieDetailsIdentifiersProps = {
  movie: MovieDetails
}

export function MovieDetailsIdentifiers({ movie }: MovieDetailsIdentifiersProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b1223]/75 p-5 backdrop-blur-md sm:p-6">
      <h2 className="text-xl font-semibold text-white">Identifiers & links</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-300/75">TMDB ID</p>
          <p className="mt-2 text-sm font-medium text-white">{movie.id}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-300/75">IMDb ID</p>
          <p className="mt-2 text-sm font-medium text-white">{movie.imdb_id || "Unknown"}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-300/75">Homepage</p>
          {movie.homepage ? (
            <Link
              href={movie.homepage}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block break-all text-sm font-medium text-cyan-300 hover:underline"
            >
              {movie.homepage}
            </Link>
          ) : (
            <p className="mt-2 text-sm font-medium text-white">Not provided</p>
          )}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-300/75">Collection</p>
          <p className="mt-2 text-sm font-medium text-white">
            {movie.belongs_to_collection?.name || "Standalone movie"}
          </p>
        </div>
      </div>
    </section>
  )
}
