import type { PersonCombinedCreditsResponse } from "../types/person-credits"

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function getPersonCombinedCreditsUrl(personId: number) {
  const params = new URLSearchParams({
    language: "en-US",
  })
  return `https://api.themoviedb.org/3/person/${personId}/combined_credits?${params.toString()}`
}

export async function getPersonCombinedCredits(
  personId: number
): Promise<PersonCombinedCreditsResponse | null> {
  const token = getTmdbToken()
  if (!token) return null

  const response = await fetch(getPersonCombinedCreditsUrl(personId), {
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

  const data = (await response.json()) as PersonCombinedCreditsResponse
  return data
}
