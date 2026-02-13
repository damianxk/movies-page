import { type Movie } from "@/types/movie"

const ONE_HOUR_IN_SECONDS = 3600

const MOVIE_LIST_ENDPOINTS = {
  now_playing: "now_playing",
  popular: "popular",
  top_rated: "top_rated",
  upcoming: "upcoming",
} as const

export type MovieListCategory = keyof typeof MOVIE_LIST_ENDPOINTS

type MovieListResponse = {
  page: number
  total_pages: number
  total_results: number
  results?: Movie[]
  dates?: {
    minimum?: string
    maximum?: string
  }
}

export type MovieListResult = {
  page: number
  totalPages: number
  totalResults: number
  dates: {
    minimum?: string
    maximum?: string
  } | null
  movies: Movie[]
}

type MovieListsBundle = {
  nowPlaying: MovieListResult
  popular: MovieListResult
  topRated: MovieListResult
  upcoming: MovieListResult
}

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function toSafePage(value?: number) {
  if (!Number.isFinite(value)) return 1
  return Math.max(1, Math.floor(value as number))
}

function getMovieListUrl(category: MovieListCategory, page: number) {
  const endpoint = MOVIE_LIST_ENDPOINTS[category]
  const params = new URLSearchParams({
    language: "en-US",
    page: String(toSafePage(page)),
  })
  return `https://api.themoviedb.org/3/movie/${endpoint}?${params.toString()}`
}

export async function getMovieList(
  category: MovieListCategory,
  page = 1,
): Promise<MovieListResult> {
  const token = getTmdbToken()
  if (!token) {
    return {
      page: 1,
      totalPages: 0,
      totalResults: 0,
      dates: null,
      movies: [],
    }
  }

  const response = await fetch(getMovieListUrl(category, page), {
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
      dates: null,
      movies: [],
    }
  }

  const data: MovieListResponse = await response.json()

  return {
    page: data.page ?? 1,
    totalPages: data.total_pages ?? 0,
    totalResults: data.total_results ?? 0,
    dates: data.dates ?? null,
    movies: data.results ?? [],
  }
}

export async function getMovieLists(page = 1) {
  const [nowPlaying, popular, topRated, upcoming] = await Promise.all([
    getMovieList("now_playing", page),
    getMovieList("popular", page),
    getMovieList("top_rated", page),
    getMovieList("upcoming", page),
  ])

  return {
    nowPlaying,
    popular,
    topRated,
    upcoming,
  }
}

function appendUniqueMovies(current: Movie[], incoming: Movie[]) {
  const merged = [...current]
  const seen = new Set(current.map((movie) => movie.id))

  for (const movie of incoming) {
    if (seen.has(movie.id)) continue
    merged.push(movie)
    seen.add(movie.id)
  }

  return merged
}

export async function getMovieListUpToPage(
  category: MovieListCategory,
  requestedPage = 1,
): Promise<MovieListResult> {
  const firstPage = await getMovieList(category, 1)
  if (firstPage.totalPages <= 1) {
    return firstPage
  }

  const targetPage = Math.min(toSafePage(requestedPage), firstPage.totalPages)
  if (targetPage <= 1) {
    return firstPage
  }

  const restPages = await Promise.all(
    Array.from({ length: targetPage - 1 }, (_, index) => getMovieList(category, index + 2)),
  )

  const movies = restPages.reduce(
    (accumulator, pageResult) => appendUniqueMovies(accumulator, pageResult.movies),
    firstPage.movies,
  )

  return {
    page: targetPage,
    totalPages: firstPage.totalPages,
    totalResults: firstPage.totalResults,
    dates: firstPage.dates,
    movies,
  }
}

export async function getMovieListsUpToPages(pages: {
  nowPlaying: number
  popular: number
  topRated: number
  upcoming: number
}): Promise<MovieListsBundle> {
  const [nowPlaying, popular, topRated, upcoming] = await Promise.all([
    getMovieListUpToPage("now_playing", pages.nowPlaying),
    getMovieListUpToPage("popular", pages.popular),
    getMovieListUpToPage("top_rated", pages.topRated),
    getMovieListUpToPage("upcoming", pages.upcoming),
  ])

  return {
    nowPlaying,
    popular,
    topRated,
    upcoming,
  }
}
