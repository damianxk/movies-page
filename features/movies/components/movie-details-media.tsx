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
  const safeVideos = Array.isArray(videos) ? videos : []
  const trailers = safeVideos.filter(isTrailer)
  const featuredTrailer = trailers[0]

  return (
    <section className="py-1">
      <h2 className="text-lg font-semibold text-white">Trailer</h2>

      {featuredTrailer ? (
        <div className="mt-2.5 space-y-2.5">
          <div className="overflow-hidden rounded-xl bg-black/40 shadow-xl shadow-black/30">
            <iframe
              src={getYoutubeEmbedUrl(featuredTrailer.key)}
              title={featuredTrailer.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="h-[165px] w-full md:h-[190px]"
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
                  className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-slate-100 hover:bg-white/20"
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
