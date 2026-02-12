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

  const activeMovie = useMemo(() => {
    if (!movies.length) return null;
    return movies.find((movie) => movie.id === resolvedActiveMovieId) ?? movies[0];
  }, [movies, resolvedActiveMovieId]);

  useEffect(() => {
    if (!movies.length) {
      setActiveMovieId(null);
      setPendingMovieId(null);
      setImageLoaded(false);
      setTransitionPhase("idle");
      return;
    }

    if (!hasActiveMovie) {
      setActiveMovieId(movies[0].id);
      setPendingMovieId(null);
      setImageLoaded(false);
      setTransitionPhase("entering");
      return;
    }

    if (pendingMovieId !== null && !hasPendingMovie) {
      setPendingMovieId(null);
    }
  }, [movies, hasActiveMovie, hasPendingMovie, pendingMovieId]);

  useEffect(() => {
    if (transitionPhase !== "exiting" || pendingMovieId === null) return;

    const timeoutId = window.setTimeout(() => {
      setActiveMovieId(pendingMovieId);
      setPendingMovieId(null);
      setImageLoaded(false);
      setTransitionPhase("entering");
    }, EXIT_TRANSITION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [transitionPhase, pendingMovieId]);

  const handleSelectMovie = useCallback(
    (movie: Movie) => {
      if (
        movie.id === pendingMovieId ||
        (pendingMovieId === null && movie.id === activeMovie?.id)
      ) {
        return;
      }

      setPendingMovieId(movie.id);
      setTransitionPhase("exiting");
    },
    [activeMovie?.id, pendingMovieId],
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

  const selectedMovieId = pendingMovieId ?? resolvedActiveMovieId;

  return {
    activeMovie,
    selectedMovieId,
    isTransitioning: transitionPhase !== "idle",
    imageLoaded,
    handleImageLoad,
    handleSelectMovie,
  };
}
