"use client";

import { useState, useCallback, useMemo } from "react";
import { Movie } from "@/types/movie";

export function useMovieHero(movies: Movie[]) {
  const [activeMovieId, setActiveMovieId] = useState<number | null>(
    movies[0]?.id ?? null,
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const activeMovie = useMemo(() => {
    if (!movies.length) return null;
    return movies.find((movie) => movie.id === activeMovieId) ?? movies[0];
  }, [movies, activeMovieId]);

  const handleSelectMovie = useCallback(
    (movie: Movie) => {
      if (movie.id === activeMovie?.id) return;

      setIsTransitioning(true);
      setImageLoaded(false);

      const timeoutId = window.setTimeout(() => {
        setActiveMovieId(movie.id);
        setIsTransitioning(false);
      }, 300);

      return () => window.clearTimeout(timeoutId);
    },
    [activeMovie?.id],
  );

  return {
    activeMovie,
    isTransitioning,
    imageLoaded,
    setImageLoaded,
    handleSelectMovie,
  };
}
