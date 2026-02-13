// @/components/custom-ui/hero-content.tsx
import { HugeiconsIcon } from "@hugeicons/react"
import { HelpCircleIcon, UserIcon } from "@hugeicons/core-free-icons"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StarRating } from "./star-rating"
import { calculateStarRating, getReleaseYear } from "@/lib/movie-utils"
import { Movie } from "@/types/movie"
import { cn } from "@/lib/utils"

type HeroContentProps = {
    movie: Movie
    isVisible: boolean
}

export const HeroContent = ({ movie, isVisible }: HeroContentProps) => {
    const stars = calculateStarRating(movie.vote_average)

    return (
        <div
            className={cn(
                // Dodajemy 'relative', aby pozycjonować tło względem tego kontenera
                "relative mb-5 md:mb-7 max-w-xl md:max-w-2xl lg:max-w-3xl transition-all duration-500 z-20",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
        >
            {/* --- NOWY ELEMENT: LOCAL BACKDROP --- */}
            {/* To tworzy miękką "chmurę" ciemności za tekstem, poprawiając czytelność na jasnych plakatach */}
            <div
                className="pointer-events-none absolute -inset-x-6 -inset-y-8 -z-10 
                   bg-linear-to-t from-background/95 via-background/70 to-transparent 
                   blur-2xl md:blur-3xl rounded-[3rem] opacity-90"
                aria-hidden="true"
            />
            {/* ------------------------------------- */}

            <h1 className="mb-2 text-2xl font-black uppercase italic tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-7xl text-balance drop-shadow-md">
                {movie.title}
            </h1>

            <p className="mb-2 md:mb-3 text-xs sm:text-sm font-medium text-muted-foreground lg:text-base drop-shadow-sm">
                {getReleaseYear(movie.release_date)}
            </p>

            {/* Przekazujemy oba parametry do gwiazdek */}
            <StarRating rating={stars} displayValue={movie.vote_average} />

            <div className="mb-4 md:mb-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="gap-2 w-full sm:w-auto shadow-lg">
                    <Link href={`/movies/${movie.id}`}>
                        <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} className="h-4 w-4" />
                        <span>See Details</span>
                    </Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="gap-2 w-full sm:w-auto shadow-md">
                    <Link href={`/movies/${movie.id}/credits`}>
                        <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="h-4 w-4" />
                        <span>See Cast</span>
                    </Link>
                </Button>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground/90 line-clamp-2 sm:line-clamp-3 lg:text-base lg:line-clamp-4 drop-shadow-sm max-w-prose">
                {movie.overview || "No overview available."}
            </p>
        </div>
    )
}