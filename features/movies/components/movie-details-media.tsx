import Link from "next/link"
import { type MovieVideo } from "@/features/movies/types/movie-videos"

type MovieDetailsMediaProps = {
  videos: MovieVideo[]
}

function isTrailer(video: MovieVideo) {
  return video.site === "YouTube" && video.type === "Trailer"
}

function getYoutubeUrl(key: string) {
  return `https://www.youtube.com/watch?v=${key}`
}

function getYoutubeEmbedUrl(key: string) {
  return `https://www.youtube.com/embed/${key}`
}

export function MovieDetailsMedia({ videos }: MovieDetailsMediaProps) {
  const trailers = videos.filter(isTrailer)
  const featuredTrailer = trailers[0]

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b1223]/75 p-5 backdrop-blur-md sm:p-6">
      <h2 className="text-xl font-semibold text-white">Media</h2>

      {featuredTrailer ? (
        <div className="mt-4 space-y-4">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
            <iframe
              src={getYoutubeEmbedUrl(featuredTrailer.key)}
              title={featuredTrailer.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="aspect-video w-full"
            />
          </div>

          {trailers.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {trailers.slice(1, 6).map((trailer) => (
                <Link
                  key={trailer.id}
                  href={getYoutubeUrl(trailer.key)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-200 hover:bg-cyan-500/20"
                >
                  {trailer.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-300/80">No trailers available for this movie.</p>
      )}
    </section>
  )
}
