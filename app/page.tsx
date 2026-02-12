import MoviesHero from "@/components/movies-hero"
import { getPopularMovies } from "@/features/movies/server/get-popular-movies"

export default async function Page() {
  const movies = await getPopularMovies()

  return (
    <main className="flex-1 h-full w-full flex flex-col justify-center bg-background">
      <MoviesHero movies={movies} />
    </main>
  )
}