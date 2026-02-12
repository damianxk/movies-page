import { type MovieDetails } from "@/features/movies/types/movie-details"

type MovieDetailsJsonProps = {
  movie: MovieDetails
}

export function MovieDetailsJson({ movie }: MovieDetailsJsonProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b1223]/75 p-5 backdrop-blur-md sm:p-6">
      <details>
        <summary className="cursor-pointer text-base font-semibold text-white">
          Full API payload
        </summary>
        <p className="mt-2 text-sm text-slate-300/80">
          Technical view of all fields returned from TMDB details endpoint.
        </p>
        <pre className="mt-4 max-h-[420px] overflow-auto rounded-xl border border-white/10 bg-black/30 p-4 text-xs leading-relaxed text-slate-200">
          {JSON.stringify(movie, null, 2)}
        </pre>
      </details>
    </section>
  )
}
