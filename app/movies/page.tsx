import Image from "next/image"
import Link from "next/link"

import { getMovieLists } from "@/features/movies/server/get-movie-lists"
import { getMoviePosterUrl } from "@/lib/movie-utils"
import { type Movie } from "@/types/movie"

type MoviesPageProps = {
  searchParams: Promise<{ page?: string }>
}

type MoviesSectionProps = {
  title: string
  subtitle: string
  movies: Movie[]
}

function toSafePage(value?: string) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) return 1
  return parsed
}

function formatVote(value?: number) {
  if (!value) return "No rating"
  return `${value.toFixed(1)} / 10`
}

function formatDateRange(minimum?: string, maximum?: string) {
  if (!minimum || !maximum) return null

  const formatter = new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  const minDate = new Date(minimum)
  const maxDate = new Date(maximum)
  if (Number.isNaN(minDate.getTime()) || Number.isNaN(maxDate.getTime())) {
    return null
  }

  return `${formatter.format(minDate)} - ${formatter.format(maxDate)}`
}

function MoviesSection({ title, subtitle, movies }: MoviesSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {!movies.length ? (
        <div className="rounded-xl border border-border/60 bg-card/40 px-4 py-8 text-center text-sm text-muted-foreground">
          Brak filmow do wyswietlenia w tej sekcji.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`}
              className="group overflow-hidden rounded-xl border border-border/50 bg-card/40 transition-colors hover:border-primary/60"
            >
              <div className="relative aspect-2/3 w-full">
                <Image
                  src={getMoviePosterUrl(movie.poster_path, "w500")}
                  alt={movie.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>

              <div className="space-y-1 p-3">
                <p className="line-clamp-1 text-sm font-medium text-foreground">{movie.title}</p>
                <p className="text-xs text-muted-foreground">
                  {movie.release_date || "Data premiery nieznana"}
                </p>
                <p className="text-xs text-muted-foreground">{formatVote(movie.vote_average)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const { page } = await searchParams
  const requestedPage = toSafePage(page)

  const { nowPlaying, popular, topRated, upcoming } = await getMovieLists(requestedPage)

  const nowPlayingDates = formatDateRange(nowPlaying.dates?.minimum, nowPlaying.dates?.maximum)
  const upcomingDates = formatDateRange(upcoming.dates?.minimum, upcoming.dates?.maximum)

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[1640px] flex-col gap-10 px-4 pb-10 pt-24 sm:px-6 lg:px-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Movies</h1>
        <p className="text-sm text-muted-foreground">
          Zestawienie z 4 endpointow TMDB. Strona: {requestedPage}
        </p>
      </header>

      <MoviesSection
        title="Now Playing"
        subtitle={
          nowPlayingDates
            ? `Aktualnie w kinach (${nowPlayingDates})`
            : "Aktualnie w kinach"
        }
        movies={nowPlaying.movies}
      />

      <MoviesSection
        title="Popular"
        subtitle="Najpopularniejsze filmy wg TMDB"
        movies={popular.movies}
      />

      <MoviesSection
        title="Top Rated"
        subtitle="Najwyzej oceniane filmy"
        movies={topRated.movies}
      />

      <MoviesSection
        title="Upcoming"
        subtitle={upcomingDates ? `Nadchodzace premiery (${upcomingDates})` : "Nadchodzace premiery"}
        movies={upcoming.movies}
      />
    </main>
  )
}
