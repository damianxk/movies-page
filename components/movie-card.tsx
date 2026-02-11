"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getMoviePosterUrl } from "@/lib/movie-utils"
import { Movie } from "@/types/movie"

type MovieCardProps = {
    movie: Movie
    isSelected: boolean
    onSelect: (movie: Movie) => void
}

const MovieCard = ({ movie, isSelected, onSelect }: MovieCardProps) => {
    const posterUrl = getMoviePosterUrl(movie.poster_path, "w500")

    return (
        <Card
            onClick={() => onSelect(movie)}
            className={cn(
                "group/card relative aspect-2/3 w-full cursor-pointer rounded-xl border-0 bg-transparent p-1 transition-all duration-300",
                isSelected
                    ? "z-10 ring-2 ring-inset ring-primary/80"
                    : "ring-1 ring-inset ring-transparent"
            )}
        >
            <div className="relative h-full w-full overflow-hidden rounded-[10px]">
                <Image
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={cn(
                        "object-cover transition-transform duration-500 will-change-transform",
                        isSelected ? "scale-[1.01]" : "group-hover/card:scale-[1.03]"
                    )}
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/90 via-black/45 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end p-3 text-center">
                    <p
                        className={cn(
                            "w-full truncate text-sm font-semibold drop-shadow-md transition-colors duration-300",
                            isSelected ? "text-white" : "text-white/90 group-hover/card:text-white"
                        )}
                    >
                        {movie.title}
                    </p>
                </div>
            </div>
        </Card>
    )
}

export default MovieCard