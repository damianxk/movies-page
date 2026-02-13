import Image from "next/image"
import Link from "next/link"
import { type CastMember } from "@/features/movies/types/movie-credits"
import { getMoviePosterUrl } from "@/lib/movie-utils"
import { MovieSectionTitle } from "@/features/movies/components/movie-section-title"

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
      <MovieSectionTitle
        title="Top billed cast"
        count={topBilledCast.length}
        href={`/movies/${movieId}/credits`}
      />

      {topBilledCast.length ? (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {topBilledCast.map((member) => (
            <Link key={member.id} href={`/people/${member.id}`} className="group min-w-0">
              <div className="mx-auto relative h-14 w-14 overflow-hidden rounded-full bg-white/10">
                <Image
                  src={getMoviePosterUrl(member.profile_path, "w500")}
                  alt={member.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 line-clamp-2 text-center text-sm font-semibold text-white transition-colors group-hover:text-primary">
                {member.name}
              </p>
              <p className="mt-1 line-clamp-2 text-center text-[11px] text-slate-300/80">
                {member.character || "Unknown role"}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-300/80">No cast data available.</p>
      )}
    </section>
  )
}
