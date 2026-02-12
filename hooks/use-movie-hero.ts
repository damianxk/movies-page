"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Movie } from "@/types/movie";

const EXIT_TRANSITION_MS = 560;
type TransitionPhase = "idle" | "exiting" | "entering";

export function useMovieHero(movies: Movie[]) {
  const [activeMovieId, setActiveMovieId] = useState<number | null>(
    movies[0]?.id ?? null,
  );
  const [nextMovieId, setNextMovieId] = useState<number | null>(null);
  const [transitionPhase, setTransitionPhase] =
    useState<TransitionPhase>("entering");
  const [imageLoaded, setImageLoaded] = useState(false);

  const activeMovie = useMemo(() => {
    if (!movies.length) return null;
    return movies.find((movie) => movie.id === activeMovieId) ?? movies[0];
  }, [movies, activeMovieId]);

  useEffect(() => {
    if (!movies.length) {
      setActiveMovieId(null);
      setNextMovieId(null);
      setImageLoaded(false);
      setTransitionPhase("idle");
      return;
    }

    const hasActiveMovie = movies.some((movie) => movie.id === activeMovieId);
    if (!hasActiveMovie) {
      setActiveMovieId(movies[0].id);
      setNextMovieId(null);
      setImageLoaded(false);
      setTransitionPhase("entering");
    }
  }, [movies, activeMovieId]);

  useEffect(() => {
    if (transitionPhase !== "exiting" || nextMovieId === null) return;

    const timeoutId = window.setTimeout(() => {
      setActiveMovieId(nextMovieId);
      setNextMovieId(null);
      setImageLoaded(false);
      setTransitionPhase("entering");
    }, EXIT_TRANSITION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [transitionPhase, nextMovieId]);

  const handleSelectMovie = useCallback(
    (movie: Movie) => {
      if (movie.id === activeMovie?.id || movie.id === nextMovieId) return;

      setNextMovieId(movie.id);
      setImageLoaded(false);
      setTransitionPhase("exiting");
    },
    [activeMovie?.id, nextMovieId],
  );

  const handleImageLoad = useCallback(
    (movieId: number) => {
      if (movieId !== activeMovieId) return;
      setImageLoaded(true);
      setTransitionPhase("idle");
    },
    [activeMovieId],
  );

  return {
    activeMovie,
    isTransitioning: transitionPhase !== "idle",
    imageLoaded,
    handleImageLoad,
    handleSelectMovie,
  };
}
