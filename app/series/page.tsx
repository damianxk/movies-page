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
import { getSeriesListsUpToPages } from "@/features/series/server/get-series-lists"
import { getMoviePosterUrl } from "@/lib/movie-utils"
import { type Series } from "@/types/series"

type SeriesPageProps = {
  searchParams: Promise<{
    ap?: string | string[]
    op?: string | string[]
    pp?: string | string[]
    tp?: string | string[]
  }>
}

type PageKey = "ap" | "op" | "pp" | "tp"

type SectionConfig = {
  title: string
  subtitle: string
  series: Series[]
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

function buildLoadMoreHref(
  current: { ap: number; op: number; pp: number; tp: number },
  keyName: PageKey,
  nextPage: number,
) {
  const params = new URLSearchParams({
    ap: String(current.ap),
    op: String(current.op),
    pp: String(current.pp),
    tp: String(current.tp),
  })

  params.set(keyName, String(nextPage))
  return `/series?${params.toString()}`
}

function SeriesSection({
  title,
  subtitle,
  series,
  page,
  totalPages,
  keyName,
  pagesState,
}: SectionConfig & { pagesState: { ap: number; op: number; pp: number; tp: number } }) {
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

      {!series.length ? (
        <div className="rounded-xl border border-border/60 bg-card/40 px-4 py-8 text-center text-sm text-muted-foreground">
          No series available in this section.
        </div>
      ) : (
        <Carousel
          opts={{ align: "start", loop: false, containScroll: "trimSnaps" }}
          className="px-8"
        >
          <CarouselContent className="-ml-2">
            {series.map((item) => (
              <CarouselItem
                key={`${item.id}-${title}`}
                className="pl-2 basis-[42%] sm:basis-[28%] md:basis-[21%] lg:basis-[16%] xl:basis-[13%]"
              >
                <Link
                  href={`/series/${item.id}`}
                  className="group block overflow-hidden rounded-lg border border-border/50 bg-card/40 transition-colors hover:border-primary/60"
                >
                  <div className="relative aspect-2/3 w-full">
                    <Image
                      src={getMoviePosterUrl(item.poster_path, "w500")}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 42vw, (max-width: 1024px) 21vw, 13vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="space-y-0.5 p-2">
                    <p className="line-clamp-1 text-xs font-medium text-foreground">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {item.first_air_date || "First air date unknown"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{formatVote(item.vote_average)}</p>
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

export default async function SeriesPage({ searchParams }: SeriesPageProps) {
  const params = await searchParams

  const pagesState = {
    ap: toSafePage(params.ap),
    op: toSafePage(params.op),
    pp: toSafePage(params.pp),
    tp: toSafePage(params.tp),
  }

  const { airingToday, onTheAir, popular, topRated } = await getSeriesListsUpToPages({
    airingToday: pagesState.ap,
    onTheAir: pagesState.op,
    popular: pagesState.pp,
    topRated: pagesState.tp,
  })

  const sections: SectionConfig[] = [
    {
      title: "Top Rated",
      subtitle: "Highest rated TV series",
      series: topRated.series,
      page: topRated.page,
      totalPages: topRated.totalPages,
      keyName: "tp",
    },
    {
      title: "Popular",
      subtitle: "Most popular TV series on TMDB",
      series: popular.series,
      page: popular.page,
      totalPages: popular.totalPages,
      keyName: "pp",
    },
    {
      title: "Airing Today",
      subtitle: "TV series airing today",
      series: airingToday.series,
      page: airingToday.page,
      totalPages: airingToday.totalPages,
      keyName: "ap",
    },
    {
      title: "On The Air",
      subtitle: "Currently on the air",
      series: onTheAir.series,
      page: onTheAir.page,
      totalPages: onTheAir.totalPages,
      keyName: "op",
    },

  ]

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[1640px] flex-col gap-6 px-4 pb-10 pt-24 sm:px-6 lg:px-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Series</h1>
        <p className="text-sm text-muted-foreground">
          Server-rendered lists with independent pagination per category.
        </p>
      </header>

      {sections.map((section) => (
        <SeriesSection key={section.title} {...section} pagesState={pagesState} />
      ))}
    </main>
  )
}
