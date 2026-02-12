import Image from "next/image"
import Link from "next/link"
import { type CastMember } from "@/features/movies/types/movie-credits"
import { getMoviePosterUrl } from "@/lib/movie-utils"

type MovieDetailsCastProps = {
  movieId: number
  cast: CastMember[]
}

export function MovieDetailsCast({ movieId, cast }: MovieDetailsCastProps) {
  const safeCast = Array.isArray(cast) ? cast : []
  const sortedCast = [...safeCast].sort((a, b) => a.order - b.order)
  const topBilledCast = sortedCast.slice(0, 10)

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

      <div className="mt-4">
        <Link
          href={`/movies/${movieId}/credits`}
          className="text-xs font-semibold uppercase tracking-wide text-slate-300 transition-colors hover:text-white"
        >
          Full cast list
        </Link>
      </div>
    </section>
  )
}
