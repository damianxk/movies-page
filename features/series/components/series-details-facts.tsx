import { MovieSectionTitle } from "@/features/movies/components/movie-section-title"

type FactItem = {
  label: string
  value: string
}

type SeriesDetailsFactsProps = {
  facts: FactItem[]
}

export function SeriesDetailsFacts({ facts }: SeriesDetailsFactsProps) {
  return (
    <section className="py-2">
      <MovieSectionTitle title="Series data" count={facts.length} />
      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {facts.map((fact) => (
          <div key={fact.label} className="pb-2">
            <p className="text-[11px] uppercase tracking-wider text-slate-400/80">
              {fact.label}
            </p>
            <p className="mt-2 text-sm font-medium text-white">{fact.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
