"use client"

import Image from "next/image"
import Link from "next/link"
import { type Movie } from "@/types/movie"
import { getMoviePosterUrl } from "@/lib/movie-utils"
import { MovieSectionTitle } from "@/features/movies/components/movie-section-title"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type MovieDetailsRecommendationsProps = {
  movies: Movie[]
}

export function MovieDetailsRecommendations({ movies }: MovieDetailsRecommendationsProps) {
  const safeMovies = Array.isArray(movies) ? movies : []
  const visibleMovies = safeMovies.slice(0, 16)

  return (
    <section className="py-1">
      <MovieSectionTitle title="More like this" count={visibleMovies.length} />

      {visibleMovies.length ? (
        <Carousel
          opts={{
            align: "start",
            loop: false,
            containScroll: "trimSnaps",
          }}
          className="mt-2 overflow-hidden px-7"
        >
          <CarouselContent className="-ml-2">
            {visibleMovies.map((movie) => (
              <CarouselItem
                key={movie.id}
                className="pl-2 basis-[34%] sm:basis-[24%] lg:basis-[19%] xl:basis-[16%]"
              >
                <Link
                  href={`/movies/${movie.id}`}
                  className="group block overflow-hidden rounded-lg bg-black/25"
                >
                  <div className="relative aspect-2/3 w-full overflow-hidden">
                    <Image
                      src={getMoviePosterUrl(movie.poster_path, "w500")}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 1280px) 30vw, 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-1.5">
                    <p className="truncate text-[10px] font-medium text-white">{movie.title}</p>
                    <p className="mt-1 text-[10px] text-slate-300/80">
                      {movie.release_date?.split("-")[0] || "Unknown"}
                    </p>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1 top-[40%] border-0 bg-black/45 text-white hover:bg-black/65" />
          <CarouselNext className="right-1 top-[40%] border-0 bg-black/45 text-white hover:bg-black/65" />
        </Carousel>
      ) : (
        <p className="mt-4 text-sm text-slate-300/80">No recommendations available.</p>
      )}
    </section>
  )
}
