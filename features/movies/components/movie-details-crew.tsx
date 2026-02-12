import { type CrewMember } from "@/features/movies/types/movie-credits"

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
  const featuredCrew = PRIORITY_JOBS.map((job) => crew.find((person) => person.job === job))
    .filter((person): person is CrewMember => Boolean(person))

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b1223]/75 p-5 backdrop-blur-md sm:p-6">
      <h2 className="text-xl font-semibold text-white">Crew</h2>

      {featuredCrew.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {featuredCrew.map((person) => (
            <article key={`${person.id}-${person.job}`} className="rounded-xl border border-white/10 bg-white/5 p-4">
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
