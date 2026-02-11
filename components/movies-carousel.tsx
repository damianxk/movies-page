// @/components/custom-ui/movies-carousel.tsx
"use client"

import { useMemo, useState } from "react"
import MovieCard from "./movie-card"
import { Movie } from "@/types/movie"
import { useCarouselAutoScroll } from "@/hooks/use-carousel-scroll"
import {
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

type MoviesCarouselProps = {
    movies: Movie[]
    selectedMovieId?: number | null
    onSelectMovie?: (movie: Movie) => void
    showHeader?: boolean
    compact?: boolean
}

const MoviesCarousel = ({
    movies,
    selectedMovieId,
    onSelectMovie,
    showHeader = true,
    compact = false,
}: MoviesCarouselProps) => {
    const [api, setApi] = useState<CarouselApi>()

    // Opcje muszą być stabilne, żeby embla nie robiła re-init przy rerenderach.
    const carouselOpts = useMemo(() => ({
        align: "start" as const,
        loop: true,
        containScroll: "keepSnaps" as const,
    }), [])

    const selectedIndex = useMemo(() => {
        if (!selectedMovieId) return 0
        return movies.findIndex((m) => m.id === selectedMovieId)
    }, [movies, selectedMovieId])

    useCarouselAutoScroll(api, selectedIndex)

    if (!movies.length) return null

    const selectedTitle = movies.find((m) => m.id === selectedMovieId)?.title

    return (
        <section className="w-full overflow-hidden">
            {showHeader && (
                <div className="w-full px-6 md:px-10 pb-4">
                    <h1 className="text-2xl font-semibold">Popular Movies</h1>
                    <p className="text-muted-foreground mt-1">
                        Selected: {selectedTitle ?? "None"}
                    </p>
                </div>
            )}

            <Carousel
                setApi={setApi}
                opts={carouselOpts}
                className={cn(
                    "w-full max-w-full overflow-hidden",
                    compact ? "py-4" : "py-6"
                )}
            >
                <CarouselContent
                    className={cn(
                        // Nadpisujemy domyślne -ml-4 z komponentu bazowego.
                        compact ? "-ml-2 md:-ml-3" : "-ml-3 md:-ml-4"
                    )}
                >
                    {movies.map((movie) => (
                        <CarouselItem
                            key={movie.id}
                            className={cn(
                                "relative isolate",
                                compact ? "pl-2 md:pl-3" : "pl-3 md:pl-4",
                                compact
                                    ? "basis-[36%] sm:basis-[26%] md:basis-[19%] lg:basis-[14%] xl:basis-[11%]"
                                    : "basis-[60%] sm:basis-[40%] md:basis-[28%] lg:basis-[22%] xl:basis-[18%]"
                            )}
                        >
                            <MovieCard
                                movie={movie}
                                isSelected={selectedMovieId === movie.id}
                                onSelect={(m) => onSelectMovie?.(m)}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 z-20" />
                <CarouselNext className="right-2 z-20" />
            </Carousel>
        </section>
    )
}

export default MoviesCarousel