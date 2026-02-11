const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export const getMovieBackdropUrl = (path?: string | null) =>
  path ? `${TMDB_IMAGE_BASE}/original${path}` : "/window.svg";

export const getMoviePosterUrl = (
  path?: string | null,
  size: "original" | "w500" = "original",
) => (path ? `${TMDB_IMAGE_BASE}/${size}${path}` : "/window.svg");

export const getReleaseYear = (date?: string) => {
  if (!date) return "Release date unknown";
  const year = new Date(date).getFullYear();
  return Number.isNaN(year) ? "Release date unknown" : `Release ${year}`;
};

export const calculateStarRating = (voteAverage?: number) => {
  if (!voteAverage) return 0;
  return Math.max(0, Math.min(5, voteAverage / 2));
};
