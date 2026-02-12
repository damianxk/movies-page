"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import MovieCard, { type Movie } from "@/components/custom-ui/movie-card"
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type MoviesCarouselProps = {
  movies: Movie[]
  selectedMovieId?: number | null
  onSelectMovie?: (movie: Movie) => void
  showHeader?: boolean
  compact?: boolean
}

const MoviesCarousel = ({
  movies,
  selectedMovieId: controlledSelectedMovieId,
  onSelectMovie,
  showHeader = true,
  compact = false,
}: MoviesCarouselProps) => {
  const [internalSelectedMovieId, setInternalSelectedMovieId] = useState<number | null>(
    movies[0]?.id ?? null
  )
  const [carouselApi, setCarouselApi] = useState<CarouselApi | undefined>(undefined)
  const lastHandledSelectedMovieId = useRef<number | null>(null)
  const selectedMovieId = controlledSelectedMovieId ?? internalSelectedMovieId

  const selectedMovie = useMemo(
    () => movies.find((movie) => movie.id === selectedMovieId) ?? null,
    [movies, selectedMovieId]
  )
  const selectedMovieIndex = useMemo(
    () => movies.findIndex((movie) => movie.id === selectedMovieId),
    [movies, selectedMovieId]
  )

  useEffect(() => {
    if (!carouselApi) return
    if (selectedMovieIndex < 0) return
    if (selectedMovieId == null) return

    // Nie przesuwaj karuzeli przy pierwszym renderze — to powoduje "skok" UI.
    if (lastHandledSelectedMovieId.current === null) {
      lastHandledSelectedMovieId.current = selectedMovieId
      return
    }

    if (lastHandledSelectedMovieId.current === selectedMovieId) return

    const viewportNode = carouselApi.rootNode()
    const slideNode = carouselApi.slideNodes()[selectedMovieIndex]
    if (!viewportNode || !slideNode) return

    const viewportRect = viewportNode.getBoundingClientRect()
    const slideRect = slideNode.getBoundingClientRect()
    const edgeTolerance = 2
    const isFullyVisible =
      slideRect.left >= viewportRect.left + edgeTolerance &&
      slideRect.right <= viewportRect.right - edgeTolerance

    if (!isFullyVisible) {
      carouselApi.scrollTo(selectedMovieIndex)
    }
    lastHandledSelectedMovieId.current = selectedMovieId
  }, [carouselApi, selectedMovieId, selectedMovieIndex])

  const handleSelectMovie = (movieId: number) => {
    const movie = movies.find((entry) => entry.id === movieId)
    if (!movie) return

    setInternalSelectedMovieId(movieId)
    onSelectMovie?.(movie)
  }

  if (!movies.length) {
    return (
      <div className="w-full text-center text-muted-foreground py-12">
        No movies to display.
      </div>
    )
  }

  return (
    <section className="w-full">
      {showHeader ? (
        <div className="w-full px-6 md:px-10 pb-4">
          <h1 className="text-2xl font-semibold">Popular Movies</h1>
          <p className="text-muted-foreground mt-1">
            Selected: {selectedMovie?.title ?? "None"}
          </p>
        </div>
      ) : null}

      <Carousel
        setApi={setCarouselApi}
        opts={{
          align: "start",
          loop: true,
          containScroll: "trimSnaps",
        }}
        className={`w-full max-w-full ${compact ? "px-3 md:px-7 py-1" : "px-6 md:px-10 py-2"}`}
      >
        <CarouselContent className={compact ? "gap-0 p-1.5 md:p-2" : "gap-0 p-4"}>
          {movies.map((movie) => (
            <CarouselItem
              key={movie.id}
              className={
                compact
                  ? "basis-[36%] sm:basis-[26%] md:basis-[19%] lg:basis-[14%] xl:basis-[11%]"
                  : "basis-[60%] sm:basis-[40%] md:basis-[28%] lg:basis-[22%] xl:basis-[18%]"
              }
            >
              <MovieCard
                movie={movie}
                isSelected={selectedMovieId === movie.id}
                onSelect={handleSelectMovie}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className={
            compact
              ? "left-2 top-1/2 -translate-y-1/2 z-20"
              : "left-3 top-1/2 -translate-y-1/2 z-20"
          }
        />
        <CarouselNext
          className={
            compact
              ? "right-2 top-1/2 -translate-y-1/2 z-20"
              : "right-3 top-1/2 -translate-y-1/2 z-20"
          }
        />
      </Carousel>
    </section>
  )
}

export default MoviesCarousel
