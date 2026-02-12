"use client"

import Image from "next/image"
import { getMovieBackdropUrl, getMoviePosterUrl } from "@/lib/movie-utils"
import { Movie } from "@/types/movie"
import { cn } from "@/lib/utils"

type HeroBackgroundProps = {
    movie: Movie | null
    isVisible: boolean
    onImageLoad: (movieId: number) => void
}

export const HeroBackground = ({ movie, isVisible, onImageLoad }: HeroBackgroundProps) => {
    if (!movie) return null

    const backdropUrl = getMovieBackdropUrl(movie.backdrop_path)
    const mobileUrl = getMoviePosterUrl(movie.poster_path)

    return (
        <>
            <div
                className={cn(
                    "absolute inset-0 transition-opacity",
                    isVisible ? "opacity-100" : "opacity-0"
                )}
            >
                <div className="absolute inset-0 md:hidden">
                    <Image
                        key={`${movie.id}-mobile`}
                        src={mobileUrl}
                        alt={movie.title}
                        fill
                        sizes="100vw"
                        quality={100}
                        priority
                        className="object-cover object-top"
                        onLoad={() => onImageLoad(movie.id)}
                    />
                </div>
                <div className="absolute inset-0 hidden md:block">
                    <Image
                        key={`${movie.id}-desktop`}
                        src={backdropUrl}
                        alt={movie.title}
                        fill
                        sizes="100vw"
                        quality={95}
                        priority
                        className="object-cover object-[35%_center] md:object-center"
                        onLoad={() => onImageLoad(movie.id)}
                    />
                </div>
            </div>
            <div className="absolute inset-0 bg-linear-to-r from-background/70 via-background/38 to-transparent md:from-background/60 md:via-background/28" />
            <div className="absolute inset-0 bg-linear-to-t from-background/62 via-background/22 to-transparent md:from-background/52 md:via-background/14" />
            <div className="absolute bottom-0 left-0 right-0 h-52 md:h-60 bg-linear-to-t from-background/95 to-transparent" />
        </>
    )
}