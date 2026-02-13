import { type Series } from "@/types/series"

const ONE_HOUR_IN_SECONDS = 3600

const SERIES_LIST_ENDPOINTS = {
  airing_today: "airing_today",
  on_the_air: "on_the_air",
  popular: "popular",
  top_rated: "top_rated",
} as const

export type SeriesListCategory = keyof typeof SERIES_LIST_ENDPOINTS

type SeriesListResponse = {
  page: number
  total_pages: number
  total_results: number
  results?: Series[]
}

export type SeriesListResult = {
  page: number
  totalPages: number
  totalResults: number
  series: Series[]
}

type SeriesListsBundle = {
  airingToday: SeriesListResult
  onTheAir: SeriesListResult
  popular: SeriesListResult
  topRated: SeriesListResult
}

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function toSafePage(value?: number) {
  if (!Number.isFinite(value)) return 1
  return Math.max(1, Math.floor(value as number))
}

function getSeriesListUrl(category: SeriesListCategory, page: number) {
  const endpoint = SERIES_LIST_ENDPOINTS[category]
  const params = new URLSearchParams({
    language: "en-US",
    page: String(toSafePage(page)),
  })

  return `https://api.themoviedb.org/3/tv/${endpoint}?${params.toString()}`
}

export async function getSeriesList(
  category: SeriesListCategory,
  page = 1,
): Promise<SeriesListResult> {
  const token = getTmdbToken()
  if (!token) {
    return {
      page: 1,
      totalPages: 0,
      totalResults: 0,
      series: [],
    }
  }

  const response = await fetch(getSeriesListUrl(category, page), {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    next: {
      revalidate: ONE_HOUR_IN_SECONDS,
    },
  })

  if (!response.ok) {
    return {
      page: 1,
      totalPages: 0,
      totalResults: 0,
      series: [],
    }
  }

  const data: SeriesListResponse = await response.json()

  return {
    page: data.page ?? 1,
    totalPages: data.total_pages ?? 0,
    totalResults: data.total_results ?? 0,
    series: data.results ?? [],
  }
}

function appendUniqueSeries(current: Series[], incoming: Series[]) {
  const merged = [...current]
  const seen = new Set(current.map((item) => item.id))

  for (const item of incoming) {
    if (seen.has(item.id)) continue
    merged.push(item)
    seen.add(item.id)
  }

  return merged
}

export async function getSeriesListUpToPage(
  category: SeriesListCategory,
  requestedPage = 1,
): Promise<SeriesListResult> {
  const firstPage = await getSeriesList(category, 1)
  if (firstPage.totalPages <= 1) {
    return firstPage
  }

  const targetPage = Math.min(toSafePage(requestedPage), firstPage.totalPages)
  if (targetPage <= 1) {
    return firstPage
  }

  const restPages = await Promise.all(
    Array.from({ length: targetPage - 1 }, (_, index) => getSeriesList(category, index + 2)),
  )

  const series = restPages.reduce(
    (accumulator, pageResult) => appendUniqueSeries(accumulator, pageResult.series),
    firstPage.series,
  )

  return {
    page: targetPage,
    totalPages: firstPage.totalPages,
    totalResults: firstPage.totalResults,
    series,
  }
}

export async function getSeriesListsUpToPages(pages: {
  airingToday: number
  onTheAir: number
  popular: number
  topRated: number
}): Promise<SeriesListsBundle> {
  const [airingToday, onTheAir, popular, topRated] = await Promise.all([
    getSeriesListUpToPage("airing_today", pages.airingToday),
    getSeriesListUpToPage("on_the_air", pages.onTheAir),
    getSeriesListUpToPage("popular", pages.popular),
    getSeriesListUpToPage("top_rated", pages.topRated),
  ])

  return {
    airingToday,
    onTheAir,
    popular,
    topRated,
  }
}
