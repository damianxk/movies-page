import Image from "next/image"
import { type CastMember } from "@/features/movies/types/movie-credits"
import { getMoviePosterUrl } from "@/lib/movie-utils"

type MovieDetailsCastProps = {
  cast: CastMember[]
}

export function MovieDetailsCast({ cast }: MovieDetailsCastProps) {
  const safeCast = Array.isArray(cast) ? cast : []
  const sortedCast = [...safeCast].sort((a, b) => a.order - b.order)
  const topBilledCast = sortedCast.slice(0, 10)
  const fullCast = sortedCast.slice(0, 30)

  return (
    <section className="py-2">
      <h2 className="text-lg font-semibold text-white">Top billed cast</h2>

      {topBilledCast.length ? (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {topBilledCast.map((member) => (
            <article key={member.id} className="group min-w-[120px] max-w-[120px]">
              <div className="mx-auto relative h-14 w-14 overflow-hidden rounded-full bg-white/10">
                <Image
                  src={getMoviePosterUrl(member.profile_path, "w500")}
                  alt={member.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-center text-sm font-semibold text-white transition-colors group-hover:text-primary">
                {member.name}
              </p>
              <p className="mt-1 line-clamp-2 text-center text-[11px] text-slate-300/80">
                {member.character || "Unknown role"}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-300/80">No cast data available.</p>
      )}

      {fullCast.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-slate-300 hover:text-white">
            Full cast list
          </summary>
          <div className="mt-2 max-h-72 divide-y divide-white/10 overflow-y-auto pr-1">
            {fullCast.map((member) => (
              <div
                key={`full-${member.id}-${member.order}`}
                className="grid grid-cols-[1fr_1fr] gap-2 py-2 text-xs"
              >
                <span className="text-white">{member.name}</span>
                <span className="text-slate-300/80">{member.character || "Unknown role"}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </section>
  )
}
