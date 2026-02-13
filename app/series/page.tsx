import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
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
    <section className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <p className="text-xs text-muted-foreground/85">
          Loaded pages: {Math.max(page, 1)} / {Math.max(totalPages, 1)}
        </p>
      </div>

      {!series.length ? (
        <div className="rounded-xl border border-border/60 bg-card/40 px-4 py-8 text-center text-sm text-muted-foreground">
          No series available in this section.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {series.map((item) => (
            <Link
              key={`${item.id}-${title}`}
              href={`/series/${item.id}`}
              className="group overflow-hidden rounded-xl border border-border/50 bg-card/40 transition-colors hover:border-primary/60"
            >
              <div className="relative aspect-2/3 w-full">
                <Image
                  src={getMoviePosterUrl(item.poster_path, "w500")}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>

              <div className="space-y-1 p-3">
                <p className="line-clamp-1 text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.first_air_date || "First air date unknown"}
                </p>
                <p className="text-xs text-muted-foreground">{formatVote(item.vote_average)}</p>
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
            No more series
          </Button>
        )}
      </div>
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
    <main className="mx-auto flex min-h-svh w-full max-w-[1640px] flex-col gap-10 px-4 pb-10 pt-24 sm:px-6 lg:px-10">
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
