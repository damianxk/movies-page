import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { getMovieListsUpToPages } from "@/features/movies/server/get-movie-lists"
import { getMoviePosterUrl } from "@/lib/movie-utils"
import { type Movie } from "@/types/movie"

type MoviesPageProps = {
  searchParams: Promise<{
    np?: string | string[]
    pp?: string | string[]
    tp?: string | string[]
    up?: string | string[]
  }>
}

type PageKey = "np" | "pp" | "tp" | "up"

type SectionConfig = {
  title: string
  subtitle: string
  movies: Movie[]
  page: number
  totalPages: number
  keyName: PageKey
}

function toSafePage(value?: string | string[]) {
  const source = Array.isArray(value) ? value[0] : value
  const parsed = Number(source)
  if (!Number.isInteger(parsed) || parsed <= 0) return 1
  return parsed
}

function formatVote(value?: number) {
  if (!value) return "No rating"
  return `${value.toFixed(1)} / 10`
}

function formatDateRange(minimum?: string, maximum?: string) {
  if (!minimum || !maximum) return null

  const formatter = new Intl.DateTimeFormat("en-US", {
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

function buildLoadMoreHref(
  current: { np: number; pp: number; tp: number; up: number },
  keyName: PageKey,
  nextPage: number,
) {
  const params = new URLSearchParams({
    np: String(current.np),
    pp: String(current.pp),
    tp: String(current.tp),
    up: String(current.up),
  })

  params.set(keyName, String(nextPage))
  return `/movies?${params.toString()}`
}

function MoviesSection({
  title,
  subtitle,
  movies,
  page,
  totalPages,
  keyName,
  pagesState,
}: SectionConfig & { pagesState: { np: number; pp: number; tp: number; up: number } }) {
  const canLoadMore = page < totalPages
  const nextPage = page + 1
  const loadMoreHref = buildLoadMoreHref(pagesState, keyName, nextPage)

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <p className="text-xs text-muted-foreground/85">
          Loaded pages: {Math.max(page, 1)} / {Math.max(totalPages, 1)}
        </p>
      </div>

      {!movies.length ? (
        <div className="rounded-xl border border-border/60 bg-card/40 px-4 py-8 text-center text-sm text-muted-foreground">
          No movies available in this section.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {movies.map((movie) => (
            <Link
              key={`${movie.id}-${title}`}
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
                  {movie.release_date || "Release date unknown"}
                </p>
                <p className="text-xs text-muted-foreground">{formatVote(movie.vote_average)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-start">
        {canLoadMore ? (
          <Button asChild className="min-w-36">
            <Link href={loadMoreHref} scroll={false}>
              Load more
            </Link>
          </Button>
        ) : (
          <Button disabled className="min-w-36">
            No more movies
          </Button>
        )}
      </div>
    </section>
  )
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const params = await searchParams

  const pagesState = {
    np: toSafePage(params.np),
    pp: toSafePage(params.pp),
    tp: toSafePage(params.tp),
    up: toSafePage(params.up),
  }

  const { nowPlaying, popular, topRated, upcoming } = await getMovieListsUpToPages({
    nowPlaying: pagesState.np,
    popular: pagesState.pp,
    topRated: pagesState.tp,
    upcoming: pagesState.up,
  })

  const nowPlayingDates = formatDateRange(nowPlaying.dates?.minimum, nowPlaying.dates?.maximum)
  const upcomingDates = formatDateRange(upcoming.dates?.minimum, upcoming.dates?.maximum)

  const sections: SectionConfig[] = [
    {
      title: "Now Playing",
      subtitle: nowPlayingDates ? `Now in theaters (${nowPlayingDates})` : "Now in theaters",
      movies: nowPlaying.movies,
      page: nowPlaying.page,
      totalPages: nowPlaying.totalPages,
      keyName: "np",
    },
    {
      title: "Popular",
      subtitle: "Most popular movies on TMDB",
      movies: popular.movies,
      page: popular.page,
      totalPages: popular.totalPages,
      keyName: "pp",
    },
    {
      title: "Top Rated",
      subtitle: "Highest rated movies",
      movies: topRated.movies,
      page: topRated.page,
      totalPages: topRated.totalPages,
      keyName: "tp",
    },
    {
      title: "Upcoming",
      subtitle: upcomingDates ? `Upcoming releases (${upcomingDates})` : "Upcoming releases",
      movies: upcoming.movies,
      page: upcoming.page,
      totalPages: upcoming.totalPages,
      keyName: "up",
    },
  ]

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[1640px] flex-col gap-10 px-4 pb-10 pt-24 sm:px-6 lg:px-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Movies</h1>
        <p className="text-sm text-muted-foreground">
          Server-rendered lists with independent pagination per category.
        </p>
      </header>

      {sections.map((section) => (
        <MoviesSection key={section.title} {...section} pagesState={pagesState} />
      ))}
    </main>
  )
}
