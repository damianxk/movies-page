import { type CrewMember } from "@/features/movies/types/movie-credits"
import { MovieSectionTitle } from "@/features/movies/components/movie-section-title"

type MovieDetailsCrewProps = {
  crew: CrewMember[]
}

const PRIORITY_JOBS = [
  "Director",
  "Screenplay",
  "Writer",
  "Original Music Composer",
  "Director of Photography",
  "Producer",
]

export function MovieDetailsCrew({ crew }: MovieDetailsCrewProps) {
  const safeCrew = Array.isArray(crew) ? crew : []
  const featuredCrew = PRIORITY_JOBS.map((job) => safeCrew.find((person) => person.job === job))
    .filter((person): person is CrewMember => Boolean(person))

  return (
    <section className="py-2">
      <MovieSectionTitle title="Crew" count={featuredCrew.length} />

      {featuredCrew.length ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCrew.map((person) => (
            <article key={`${person.id}-${person.job}`} className="border-l-2 border-primary/60 pl-3">
              <p className="text-xs uppercase tracking-wider text-slate-300/70">{person.job}</p>
              <p className="mt-2 text-sm font-semibold text-white">{person.name}</p>
              <p className="mt-1 text-xs text-slate-300/80">{person.department}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-300/80">No crew data available.</p>
      )}
    </section>
  )
}
