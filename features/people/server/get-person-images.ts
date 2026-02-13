import type { PersonImagesResponse } from "../types/person-images"

function getTmdbToken() {
  return process.env.TMDB_API_KEY
}

function getPersonImagesUrl(personId: number) {
  return `https://api.themoviedb.org/3/person/${personId}/images`
}

export async function getPersonImages(personId: number): Promise<PersonImagesResponse | null> {
  const token = getTmdbToken()
  if (!token) return null

  const response = await fetch(getPersonImagesUrl(personId), {
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

  const data = (await response.json()) as PersonImagesResponse
  return data
}
