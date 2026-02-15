import type { PopularPeopleResponse, PopularPerson } from "../types/popular-people"

const ONE_HOUR_IN_SECONDS = 3600

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function getPopularPeopleUrl(page = 1) {
  const params = new URLSearchParams({
    language: "en-US",
    page: String(page),
  })

  return `https://api.themoviedb.org/3/person/popular?${params.toString()}`
}

export async function getPopularPeople(page = 1): Promise<PopularPerson[]> {
  const token = getTmdbToken()
  if (!token) return []

  const response = await fetch(getPopularPeopleUrl(page), {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    next: {
      revalidate: ONE_HOUR_IN_SECONDS,
    },
  })

  if (!response.ok) return []

  const data = (await response.json()) as PopularPeopleResponse
  return data.results ?? []
}
