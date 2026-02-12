"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Movie } from "@/types/movie";

const EXIT_TRANSITION_MS = 560;
type TransitionPhase = "idle" | "exiting" | "entering";

export function useMovieHero(movies: Movie[]) {
  const [activeMovieId, setActiveMovieId] = useState<number | null>(
    movies[0]?.id ?? null,
  );
  const [pendingMovieId, setPendingMovieId] = useState<number | null>(null);
  const [transitionPhase, setTransitionPhase] =
    useState<TransitionPhase>("entering");
  const [imageLoaded, setImageLoaded] = useState(false);

  const hasActiveMovie = useMemo(
    () => movies.some((movie) => movie.id === activeMovieId),
    [movies, activeMovieId],
  );

  const hasPendingMovie = useMemo(
    () => movies.some((movie) => movie.id === pendingMovieId),
    [movies, pendingMovieId],
  );

  const resolvedActiveMovieId = hasActiveMovie
    ? activeMovieId
    : (movies[0]?.id ?? null);
  const resolvedPendingMovieId =
    pendingMovieId !== null && hasPendingMovie ? pendingMovieId : null;

  const activeMovie = useMemo(() => {
    if (!movies.length) return null;
    return movies.find((movie) => movie.id === resolvedActiveMovieId) ?? movies[0];
  }, [movies, resolvedActiveMovieId]);

  useEffect(() => {
    if (transitionPhase !== "exiting" || resolvedPendingMovieId === null) return;

    const timeoutId = window.setTimeout(() => {
      setActiveMovieId(resolvedPendingMovieId);
      setPendingMovieId(null);
      setImageLoaded(false);
      setTransitionPhase("entering");
    }, EXIT_TRANSITION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [transitionPhase, resolvedPendingMovieId]);

  const handleSelectMovie = useCallback(
    (movie: Movie) => {
      if (
        movie.id === resolvedPendingMovieId ||
        (resolvedPendingMovieId === null && movie.id === activeMovie?.id)
      ) {
        return;
      }

      setPendingMovieId(movie.id);
      setTransitionPhase("exiting");
    },
    [activeMovie?.id, resolvedPendingMovieId],
  );

  const handleImageLoad = useCallback(
    (movieId: number) => {
      if (transitionPhase !== "entering") return;
      if (movieId !== resolvedActiveMovieId) return;
      setImageLoaded(true);
      setTransitionPhase("idle");
    },
    [resolvedActiveMovieId, transitionPhase],
  );

  const selectedMovieId = resolvedPendingMovieId ?? resolvedActiveMovieId;

  return {
    activeMovie,
    selectedMovieId,
    isTransitioning: transitionPhase !== "idle",
    imageLoaded,
    handleImageLoad,
    handleSelectMovie,
  };
}
