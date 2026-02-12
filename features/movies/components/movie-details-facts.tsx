type FactItem = {
  label: string
  value: string
}

type MovieDetailsFactsProps = {
  facts: FactItem[]
}

export function MovieDetailsFacts({ facts }: MovieDetailsFactsProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b1223]/75 p-5 backdrop-blur-md sm:p-6">
      <h2 className="text-xl font-semibold text-white">Movie data</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-300/75">
              {fact.label}
            </p>
            <p className="mt-2 text-sm font-medium text-white">{fact.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
