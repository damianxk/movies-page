import { type ProductionCompany } from "@/features/movies/types/movie-details"

type MovieDetailsCompaniesProps = {
  companies: ProductionCompany[]
}

export function MovieDetailsCompanies({ companies }: MovieDetailsCompaniesProps) {
  return (
    <section className="py-2">
      <h2 className="text-xl font-semibold text-white">Production companies</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {companies.length ? (
          companies.map((company) => (
            <article key={company.id} className="border-l-2 border-white/20 pl-3">
              <p className="font-medium text-white">{company.name}</p>
              <p className="mt-1 text-xs text-slate-300/80">
                Country: {company.origin_country || "Unknown"}
              </p>
              <p className="mt-1 text-xs text-slate-300/80">
                Logo: {company.logo_path ? "Available" : "Not available"}
              </p>
            </article>
          ))
        ) : (
          <p className="text-sm text-slate-300/80">No production companies.</p>
        )}
      </div>
    </section>
  )
}
