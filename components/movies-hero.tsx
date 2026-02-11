"use client"

import { useMovieHero } from "@/hooks/use-movie-hero"
import { Movie } from "@/types/movie"
import MoviesCarousel from "./movies-carousel"
import { HeroBackground } from "./hero-background"
import { HeroContent } from "./hero-content"

type MoviesHeroProps = {
    movies: Movie[]
}

const MoviesHero = ({ movies }: MoviesHeroProps) => {
    const {
        activeMovie,
        isTransitioning,
        imageLoaded,
        setImageLoaded,
        handleSelectMovie
    } = useMovieHero(movies)

    if (!activeMovie) {
        return (
            <section className="relative min-h-screen w-full flex items-center justify-center text-muted-foreground">
                Loading movies...
            </section>
        )
    }

    const isContentVisible = !isTransitioning && imageLoaded

    return (
        <section className="relative min-h-svh lg:min-h-[108vh] w-full overflow-hidden">
            {/* Background Layer */}
            <HeroBackground
                movie={activeMovie}
                isVisible={!isTransitioning && imageLoaded} // Ukrywamy stary obrazek dopiero jak nowy się wczyta lub podczas tranzycji
                onImageLoad={() => setImageLoaded(true)}
            />

            {/* Content Layer */}
            <div className="relative z-10 flex min-h-svh lg:min-h-[108vh] flex-col justify-end px-4 pb-3 pt-20 sm:px-6 lg:px-12 lg:pb-8 lg:pt-24">

                <HeroContent
                    movie={activeMovie}
                    isVisible={isContentVisible}
                />

                <div className="w-full">
                    <MoviesCarousel
                        movies={movies}
                        selectedMovieId={activeMovie.id}
                        onSelectMovie={handleSelectMovie}
                        showHeader={false}
                        compact
                    />
                </div>
            </div>
        </section>
    )
}

export default MoviesHero