import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getMovieCredits } from "@/features/movies/server/get-movie-credits"
import { getMovieDetails } from "@/features/movies/server/get-movie-details"
import { getMovieBackdropUrl } from "@/lib/movie-utils"
import { MovieCreditsExplorer } from "@/features/movies/components/movie-credits-explorer"

type MovieCreditsPageProps = {
  params: Promise<{ movieId: string }>
}

function toMovieId(value: string) {
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

export async function generateMetadata({ params }: MovieCreditsPageProps): Promise<Metadata> {
  const { movieId } = await params
  const parsedMovieId = toMovieId(movieId)

  if (!parsedMovieId) {
    return { title: "Movie credits" }
  }

  const movie = await getMovieDetails(parsedMovieId)
  const movieTitle = movie?.title || movie?.original_title

  if (!movieTitle) {
    return { title: "Movie credits" }
  }

  return { title: `${movieTitle} - Credits` }
}

export default async function MovieCreditsPage({ params }: MovieCreditsPageProps) {
  const { movieId } = await params
  const parsedMovieId = toMovieId(movieId)
  if (!parsedMovieId) {
    notFound()
  }

  const [movie, credits] = await Promise.all([
    getMovieDetails(parsedMovieId),
    getMovieCredits(parsedMovieId),
  ])

  if (!movie) {
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
          style={{ backgroundImage: `url('${getMovieBackdropUrl(movie.backdrop_path)}')` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#030711]/60 via-[#030711]/86 to-[#030711]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-8 pt-24 sm:px-6 lg:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300/80">Movie credits</p>
            <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
              {movie.title} - Full cast and crew
            </h1>
            <p className="mt-2 text-sm text-slate-300/85">
              Cast: {cast.length} · Crew: {crew.length}
            </p>
          </div>
          <Link
            href={`/movies/${movie.id}`}
            className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
          >
            Back to movie
          </Link>
        </div>

        <MovieCreditsExplorer cast={cast} crew={crew} />
      </div>
    </main>
  )
}
