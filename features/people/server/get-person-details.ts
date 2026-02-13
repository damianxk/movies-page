import type { PersonDetails } from "../types/person-details"

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function getPersonDetailsUrl(personId: number) {
  const params = new URLSearchParams({
    language: "en-US",
  })
  return `https://api.themoviedb.org/3/person/${personId}?${params.toString()}`
}

export async function getPersonDetails(personId: number): Promise<PersonDetails | null> {
  const token = getTmdbToken()
  if (!token) return null

  const response = await fetch(getPersonDetailsUrl(personId), {
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

  const data = (await response.json()) as PersonDetails
  return data
}
