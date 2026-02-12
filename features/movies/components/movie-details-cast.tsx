import Image from "next/image"
import { type CastMember } from "@/features/movies/types/movie-credits"
import { getMoviePosterUrl } from "@/lib/movie-utils"

type MovieDetailsCastProps = {
  cast: CastMember[]
}

export function MovieDetailsCast({ cast }: MovieDetailsCastProps) {
  const topBilledCast = [...cast].sort((a, b) => a.order - b.order).slice(0, 10)
  const fullCast = [...cast].sort((a, b) => a.order - b.order).slice(0, 30)

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b1223]/75 p-5 backdrop-blur-md sm:p-6">
      <h2 className="text-xl font-semibold text-white">Top billed cast</h2>

      {topBilledCast.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {topBilledCast.map((member) => (
            <article
              key={member.id}
              className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
            >
              <div className="mx-auto relative h-16 w-16 overflow-hidden rounded-full border border-white/15 bg-[#121b31]">
                <Image
                  src={getMoviePosterUrl(member.profile_path, "w500")}
                  alt={member.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-center text-sm font-semibold text-white">{member.name}</p>
              <p className="mt-1 text-center text-xs text-slate-300/80">{member.character}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-300/80">No cast data available.</p>
      )}

      {fullCast.length > 0 && (
        <details className="mt-6">
          <summary className="cursor-pointer text-sm font-semibold text-slate-200">
            Full cast list
          </summary>
          <div className="mt-3 divide-y divide-white/10 rounded-xl border border-white/10 bg-black/25">
            {fullCast.map((member) => (
              <div
                key={`full-${member.id}-${member.order}`}
                className="grid grid-cols-[1fr_1fr] gap-2 px-4 py-2 text-sm"
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
