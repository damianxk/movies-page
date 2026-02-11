"use client"

import Image from "next/image"
import { useCallback, useMemo, useState } from "react"

import { HugeiconsIcon } from "@hugeicons/react"
import { HelpCircleIcon, UserIcon } from "@hugeicons/core-free-icons"

import { type Movie } from "@/components/custom-ui/movie-card"
import MoviesCarousel from "@/components/custom-ui/movies-carousel"
import { Button } from "@/components/ui/button"

type MoviesHeroProps = {
  movies: Movie[]
}

function getMovieBackdropUrl(backdropPath: string | null | undefined) {
  if (!backdropPath) return "/window.svg"
  return `https://image.tmdb.org/t/p/original${backdropPath}`
}

function getMoviePosterUrl(posterPath: string | null | undefined) {
  if (!posterPath) return "/window.svg"
  return `https://image.tmdb.org/t/p/original${posterPath}`
}

function getReleaseLabel(date: string | undefined) {
  if (!date) return "Release date unknown"
  const year = new Date(date).getFullYear()
  if (Number.isNaN(year)) return "Release date unknown"
  return `Release ${year}`
}

function getFiveStarRating(voteAverage: number | undefined) {
  if (!voteAverage) return 0
  return Math.max(0, Math.min(5, voteAverage / 2))
}

const MoviesHero = ({ movies }: MoviesHeroProps) => {
  const [activeMovieId, setActiveMovieId] = useState<number | null>(
    movies[0]?.id ?? null
  )
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const activeMovie = useMemo(() => {
    if (!movies.length) return null
    return movies.find((movie) => movie.id === activeMovieId) ?? movies[0]
  }, [movies, activeMovieId])

  const handleSelect = useCallback(
    (movie: Movie) => {
      if (movie.id === activeMovie?.id) return
      setIsTransitioning(true)
      setImageLoaded(false)
      window.setTimeout(() => {
        setActiveMovieId(movie.id)
        setIsTransitioning(false)
      }, 300)
    },
    [activeMovie?.id]
  )

  const backdropUrl = useMemo(
    () => getMovieBackdropUrl(activeMovie?.backdrop_path),
    [activeMovie?.backdrop_path]
  )
  const mobileHeroUrl = useMemo(
    () => getMoviePosterUrl(activeMovie?.poster_path),
    [activeMovie?.poster_path]
  )
  const stars = getFiveStarRating(activeMovie?.vote_average)

  if (!activeMovie) {
    return (
      <section className="relative min-h-screen w-full overflow-hidden">
        <div className="relative z-10 flex min-h-screen items-center justify-center text-muted-foreground">
          Ladowanie filmow...
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-svh lg:min-h-[108vh] w-full overflow-hidden">
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isTransitioning || !imageLoaded ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 md:hidden">
          <Image
            src={mobileHeroUrl}
            alt=""
            fill
            sizes="100vw"
            quality={100}
            priority
            className="object-cover object-top"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <div className="absolute inset-0 hidden md:block">
          <Image
            src={backdropUrl}
            alt=""
            fill
            sizes="100vw"
            quality={95}
            priority
            className="object-cover object-[35%_center] md:object-center"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </div>

      <div className="absolute inset-0 bg-linear-to-r from-background/70 via-background/38 to-transparent md:from-background/60 md:via-background/28" />
      <div className="absolute inset-0 bg-linear-to-t from-background/62 via-background/22 to-transparent md:from-background/52 md:via-background/14" />
      <div className="absolute bottom-0 left-0 right-0 h-52 md:h-60 bg-linear-to-t from-background/95 to-transparent" />

      <div className="relative z-10 flex min-h-svh lg:min-h-[108vh] flex-col justify-end px-4 pb-3 pt-20 sm:px-6 lg:px-12 lg:pb-8 lg:pt-24">
        <div
          className={`mb-5 md:mb-7 max-w-xl md:max-w-2xl lg:max-w-3xl transition-all duration-500 ${
            isTransitioning
              ? "translate-y-4 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          <h1 className="mb-2 text-2xl font-black uppercase italic tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-7xl text-balance">
            {activeMovie.title}
          </h1>

          <p className="mb-2 md:mb-3 text-xs sm:text-sm font-medium text-muted-foreground lg:text-base">
            {getReleaseLabel(activeMovie.release_date)}
          </p>

          <div className="mb-3 md:mb-4 flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => {
              const isFilled = index + 1 <= Math.round(stars)
              return (
                <span
                  key={`star-${index}`}
                  className={isFilled ? "text-primary" : "text-muted-foreground/40"}
                >
                  ★
                </span>
              )
            })}
            <span className="text-sm text-muted-foreground">
              {activeMovie.vote_average?.toFixed(1) ?? "0.0"}
            </span>
          </div>

          <div className="mb-4 md:mb-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} className="h-4 w-4" />
              <span>See Details</span>
            </Button>
            <Button variant="secondary" size="lg" className="gap-2 w-full sm:w-auto">
              <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="h-4 w-4" />
              <span>See Cast</span>
            </Button>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground/85 line-clamp-2 sm:line-clamp-3 lg:text-base lg:line-clamp-4">
            {activeMovie.overview || "No overview available."}
          </p>
        </div>

        <div className="w-full">
          <MoviesCarousel
            movies={movies}
            selectedMovieId={activeMovie.id}
            onSelectMovie={handleSelect}
            showHeader={false}
            compact
          />
        </div>
      </div>
    </section>
  )
}

export default MoviesHero
