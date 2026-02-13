import Link from "next/link"
import { type SeriesDetails } from "@/features/series/types/series-details"
import { MovieSectionTitle } from "@/features/movies/components/movie-section-title"

type SeriesDetailsIdentifiersProps = {
  series: SeriesDetails
}

export function SeriesDetailsIdentifiers({ series }: SeriesDetailsIdentifiersProps) {
  return (
    <section className="py-2">
      <MovieSectionTitle title="Identifiers & links" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-300/75">TMDB ID</p>
          <p className="mt-2 text-sm font-medium text-white">{series.id}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-300/75">Type</p>
          <p className="mt-2 text-sm font-medium text-white">{series.type || "Unknown"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-300/75">Homepage</p>
          {series.homepage ? (
            <Link
              href={series.homepage}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block break-all text-sm font-medium text-cyan-300 hover:underline"
            >
              {series.homepage}
            </Link>
          ) : (
            <p className="mt-2 text-sm font-medium text-white">Not provided</p>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-300/75">Seasons / Episodes</p>
          <p className="mt-2 text-sm font-medium text-white">
            {series.number_of_seasons} / {series.number_of_episodes}
          </p>
        </div>
      </div>
    </section>
  )
}
