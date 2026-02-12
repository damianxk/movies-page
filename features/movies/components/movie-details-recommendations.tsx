import Image from "next/image"
import Link from "next/link"
import { type Movie } from "@/types/movie"
import { getMoviePosterUrl } from "@/lib/movie-utils"

type MovieDetailsRecommendationsProps = {
  movies: Movie[]
}

export function MovieDetailsRecommendations({ movies }: MovieDetailsRecommendationsProps) {
  const visibleMovies = movies.slice(0, 12)

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b1223]/75 p-5 backdrop-blur-md sm:p-6">
      <h2 className="text-xl font-semibold text-white">More like this</h2>

      {visibleMovies.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {visibleMovies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`}
              className="group overflow-hidden rounded-xl border border-white/10 bg-white/5"
            >
              <div className="relative aspect-2/3 w-full overflow-hidden">
                <Image
                  src={getMoviePosterUrl(movie.poster_path, "w500")}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-white">{movie.title}</p>
                <p className="mt-1 text-[10px] text-slate-300/80">
                  {movie.release_date?.split("-")[0] || "Unknown year"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-300/80">No recommendations available.</p>
      )}
    </section>
  )
}
