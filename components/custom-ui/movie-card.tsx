import Image from "next/image"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type Movie = {
    id: number
    title: string
    poster_path: string | null
    backdrop_path?: string | null
    overview?: string
    release_date?: string
    vote_average?: number
}

type MovieCardProps = {
    movie: Movie
    isSelected: boolean
    onSelect: (movieId: number) => void
}

const MovieCard = ({ movie, isSelected, onSelect }: MovieCardProps) => {
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/file.svg"

    return (
        <Card
            onClick={() => onSelect(movie.id)}
            className="group/card cursor-pointer truncate flex flex-col p-0 bg-transparent shadow-none transition-colors relative ring-0"
        >
            <CardContent
                className={cn(
                    "aspect-2/3 flex-1 p-0.5 rounded-lg overflow-hidden ring-inset transition-all",
                    isSelected
                        ? "ring-2 ring-primary"
                        : "ring-1 ring-border group-hover/card:ring-primary/70"
                )}
            >
                <Image
                    src={posterUrl}
                    alt={movie.title}
                    width={400}
                    height={600}
                    className="w-full h-full object-cover rounded-lg"
                />
            </CardContent>
            <CardFooter className="shadow-none py-2 px-2 text-center w-full flex items-center justify-center">
                <p className="text-foreground/80 font-medium text-base truncate group-hover/card:text-foreground">
                    {movie.title}
                </p>
            </CardFooter>
        </Card>
    )
}

export default MovieCard