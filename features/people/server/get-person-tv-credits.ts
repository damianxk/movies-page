import type { PersonTvCreditsResponse } from "../types/person-credits"

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function getPersonTvCreditsUrl(personId: number) {
  const params = new URLSearchParams({
    language: "en-US",
  })
  return `https://api.themoviedb.org/3/person/${personId}/tv_credits?${params.toString()}`
}

export async function getPersonTvCredits(personId: number): Promise<PersonTvCreditsResponse | null> {
  const token = getTmdbToken()
  if (!token) return null

  const response = await fetch(getPersonTvCreditsUrl(personId), {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    next: {
      revalidate: 3600,
    },
  })

  if (!response.ok) {
    if (response.status === 404) return null
    return null
  }

  const data = (await response.json()) as PersonTvCreditsResponse
  return data
}
