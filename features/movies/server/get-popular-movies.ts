import { type Movie } from "@/types/movie"
import { getMovieList } from "@/features/movies/server/get-movie-lists"

export async function getPopularMovies(): Promise<Movie[]> {
  const response = await getMovieList("popular", 1)
  return response.movies
}
