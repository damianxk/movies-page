import Image from "next/image"
import Link from "next/link"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { LoadMoreCarouselCard } from "@/components/load-more-carousel-card"
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
    <section className="space-y-3 rounded-2xl border border-border/60 bg-card/30 p-4 backdrop-blur-sm">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <p className="text-xs text-muted-foreground/85 sm:ml-auto">
          Loaded pages: {Math.max(page, 1)} / {Math.max(totalPages, 1)}
        </p>
      </div>

      {!movies.length ? (
        <div className="rounded-xl border border-border/60 bg-card/40 px-4 py-8 text-center text-sm text-muted-foreground">
          No movies available in this section.
        </div>
      ) : (
        <Carousel
          opts={{ align: "start", loop: false, containScroll: "trimSnaps" }}
          className="px-8"
        >
          <CarouselContent className="-ml-2">
            {movies.map((movie) => (
              <CarouselItem
                key={`${movie.id}-${title}`}
                className="pl-2 basis-[42%] sm:basis-[28%] md:basis-[21%] lg:basis-[16%] xl:basis-[13%]"
              >
                <Link
                  href={`/movies/${movie.id}`}
                  className="group block overflow-hidden rounded-lg border border-border/50 bg-card/40 transition-colors hover:border-primary/60"
                >
                  <div className="relative aspect-2/3 w-full">
                    <Image
                      src={getMoviePosterUrl(movie.poster_path, "w500")}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 640px) 42vw, (max-width: 1024px) 21vw, 13vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="space-y-0.5 p-2">
                    <p className="line-clamp-1 text-xs font-medium text-foreground">{movie.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {movie.release_date || "Release date unknown"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{formatVote(movie.vote_average)}</p>
                  </div>
                </Link>
              </CarouselItem>
            ))}
            <CarouselItem className="pl-2 basis-[42%] sm:basis-[28%] md:basis-[21%] lg:basis-[16%] xl:basis-[13%]">
              <div className="h-full min-h-[280px]">
                <LoadMoreCarouselCard
                  href={loadMoreHref}
                  canLoadMore={canLoadMore}
                  idleLabel="Load more"
                  loadingLabel="Loading..."
                  doneLabel="No more"
                />
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-1 top-[40%] border-0 bg-black/45 text-white hover:bg-black/65" />
          <CarouselNext className="right-1 top-[40%] border-0 bg-black/45 text-white hover:bg-black/65" />
        </Carousel>
      )}
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
    <main className="mx-auto flex min-h-svh w-full max-w-[1640px] flex-col gap-6 px-4 pb-10 pt-24 sm:px-6 lg:px-10">
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
