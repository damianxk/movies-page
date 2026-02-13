import { NextResponse } from "next/server"

type SearchType = "movie" | "tv" | "person"

type MovieSearchItem = {
  id: number
  title?: string
  name?: string
  poster_path?: string | null
  release_date?: string
  vote_average?: number
}

type TvSearchItem = {
  id: number
  name?: string
  poster_path?: string | null
  first_air_date?: string
  vote_average?: number
}

type PersonSearchItem = {
  id: number
  name?: string
  profile_path?: string | null
  known_for_department?: string
}

type SearchResponse<T> = {
  results?: T[]
}

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function toSafePage(value: string | null) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) return 1
  return parsed
}

function isSearchType(value: string | null): value is SearchType {
  return value === "movie" || value === "tv" || value === "person"
}

function extractYear(value?: string) {
  if (!value) return null
  const year = value.split("-")[0]
  return year || null
}

function buildSearchUrl(type: SearchType, query: string, page: number) {
  const params = new URLSearchParams({
    query,
    include_adult: "false",
    language: "en-US",
    page: String(page),
  })
  return `https://api.themoviedb.org/3/search/${type}?${params.toString()}`
}

export async function GET(request: Request) {
  const token = getTmdbToken()
  if (!token) {
    return NextResponse.json({ results: [] })
  }

  const { searchParams } = new URL(request.url)
  const typeParam = searchParams.get("type")
  const query = (searchParams.get("query") ?? "").trim()
  const page = toSafePage(searchParams.get("page"))

  if (!isSearchType(typeParam)) {
    return NextResponse.json({ error: "Invalid search type." }, { status: 400 })
  }

  if (query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const response = await fetch(buildSearchUrl(typeParam, query, page), {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    next: {
      revalidate: 60,
    },
  })

  if (!response.ok) {
    return NextResponse.json({ error: "Search request failed." }, { status: 502 })
  }

  if (typeParam === "movie") {
    const data: SearchResponse<MovieSearchItem> = await response.json()
    const mapped = (data.results ?? []).map((item) => ({
      id: item.id,
      mediaType: "movie" as const,
      title: item.title || item.name || "Untitled",
      subtitle: "Movie",
      imagePath: item.poster_path ?? null,
      year: extractYear(item.release_date),
      voteAverage: item.vote_average ?? null,
    }))
    return NextResponse.json({ results: mapped })
  }

  if (typeParam === "tv") {
    const data: SearchResponse<TvSearchItem> = await response.json()
    const mapped = (data.results ?? []).map((item) => ({
      id: item.id,
      mediaType: "tv" as const,
      title: item.name || "Untitled",
      subtitle: "TV",
      imagePath: item.poster_path ?? null,
      year: extractYear(item.first_air_date),
      voteAverage: item.vote_average ?? null,
    }))
    return NextResponse.json({ results: mapped })
  }

  const data: SearchResponse<PersonSearchItem> = await response.json()
  const mapped = (data.results ?? []).map((item) => ({
    id: item.id,
    mediaType: "person" as const,
    title: item.name || "Unknown person",
    subtitle: item.known_for_department || "Person",
    imagePath: item.profile_path ?? null,
    year: null,
    voteAverage: null,
  }))
  return NextResponse.json({ results: mapped })
}
