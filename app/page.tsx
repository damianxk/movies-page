import MoviesHero from "@/components/movies-hero"
import { type Movie } from "@/components/custom-ui/movie-card"

const TMDB_POPULAR_MOVIES_URL =
  "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1"
const TMDB_BEARER_TOKEN = process.env.TMDB_API_KEY
type PopularMoviesResponse = {
  results: Movie[]
}

async function getPopularMovies(): Promise<Movie[]> {
  const response = await fetch(TMDB_POPULAR_MOVIES_URL, {
    headers: {
      Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
      accept: "application/json",
    },
    next: {
      revalidate: 3600,
    },
  })

  if (!response.ok) {
    return []
  }

  const data: PopularMoviesResponse = await response.json()
  return data.results
}

export default async function Page() {
  const movies = await getPopularMovies()

  return (
    <main className="flex-1 h-full w-full flex flex-col justify-center bg-background">
      <MoviesHero movies={movies} />
    </main>
  )
}