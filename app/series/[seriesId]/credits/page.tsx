import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSeriesCredits } from "@/features/series/server/get-series-credits"
import { getSeriesDetails } from "@/features/series/server/get-series-details"
import { getMovieBackdropUrl } from "@/lib/movie-utils"
import { MovieCreditsExplorer } from "@/features/movies/components/movie-credits-explorer"

type SeriesCreditsPageProps = {
  params: Promise<{ seriesId: string }>
}

function toSeriesId(value: string) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) return null
  return parsed
}

function uniqueByPersonAndJob<T extends { id: number; job?: string }>(items: T[]) {
  const seen = new Set<string>()
  return items.filter((item) => {
    const key = `${item.id}-${item.job ?? ""}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export async function generateMetadata({ params }: SeriesCreditsPageProps): Promise<Metadata> {
  const { seriesId } = await params
  const parsedSeriesId = toSeriesId(seriesId)

  if (!parsedSeriesId) {
    return { title: "Series credits" }
  }

  const series = await getSeriesDetails(parsedSeriesId)
  const seriesTitle = series?.name || series?.original_name

  if (!seriesTitle) {
    return { title: "Series credits" }
  }

  return { title: `${seriesTitle} - Credits` }
}

export default async function SeriesCreditsPage({ params }: SeriesCreditsPageProps) {
  const { seriesId } = await params
  const parsedSeriesId = toSeriesId(seriesId)
  if (!parsedSeriesId) {
    notFound()
  }

  const [series, credits] = await Promise.all([
    getSeriesDetails(parsedSeriesId),
    getSeriesCredits(parsedSeriesId),
  ])

  if (!series) {
    notFound()
  }

  const cast = [...(credits.cast ?? [])].sort((a, b) => a.order - b.order)
  const crew = uniqueByPersonAndJob(credits.crew ?? []).sort((a, b) =>
    a.department.localeCompare(b.department),
  )

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030711]">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('${getMovieBackdropUrl(series.backdrop_path)}')` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#030711]/60 via-[#030711]/86 to-[#030711]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-8 pt-24 sm:px-6 lg:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300/80">Series credits</p>
            <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
              {series.name} - Full cast and crew
            </h1>
            <p className="mt-2 text-sm text-slate-300/85">
              Cast: {cast.length} · Crew: {crew.length}
            </p>
          </div>
          <Link
            href={`/series/${series.id}`}
            className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
          >
            Back to series
          </Link>
        </div>

        <MovieCreditsExplorer cast={cast} crew={crew} />
      </div>
    </main>
  )
}
