import { type ProductionCompany } from "@/features/movies/types/movie-details"

type MovieDetailsCompaniesProps = {
  companies: ProductionCompany[]
}

export function MovieDetailsCompanies({ companies }: MovieDetailsCompaniesProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b1223]/75 p-5 backdrop-blur-md sm:p-6">
      <h2 className="text-xl font-semibold text-white">Production companies</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {companies.length ? (
          companies.map((company) => (
            <article
              key={company.id}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
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
