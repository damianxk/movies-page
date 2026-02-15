import MoviesHero from "@/components/movies-hero"
import { getPopularMovies } from "@/features/movies/server/get-popular-movies"
import { PopularPeopleSection } from "@/features/people/components/popular-people-section"
import { getPopularPeople } from "@/features/people/server/get-popular-people"

export default async function Page() {
  const [movies, popularPeople] = await Promise.all([
    getPopularMovies(),
    getPopularPeople(1),
  ])

  return (
    <main className="flex-1 h-full w-full flex flex-col bg-background">
      <MoviesHero movies={movies} />
      <div className="mx-auto w-full max-w-[1640px] px-4 pb-10 pt-2 sm:px-6 lg:px-10">
        <PopularPeopleSection people={popularPeople} />
      </div>
    </main>
  )
}