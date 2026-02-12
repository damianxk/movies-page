"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { type MovieVideo } from "@/features/movies/types/movie-videos"

type MovieDetailsMediaProps = {
  videos: MovieVideo[]
}

function isTrailer(video: MovieVideo) {
  return video.site === "YouTube"
}

function getYoutubeUrl(key: string) {
  return `https://www.youtube.com/watch?v=${key}`
}

function getYoutubeThumbnailUrl(key: string) {
  return `https://img.youtube.com/vi/${key}/hqdefault.jpg`
}

function getVideoLabel(video: MovieVideo) {
  if (video.type === "Trailer") {
    return video.official ? "Official Trailer" : "Trailer"
  }
  return video.type || "Video"
}

export function MovieDetailsMedia({ videos }: MovieDetailsMediaProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const safeVideos = Array.isArray(videos) ? videos : []
  const youtubeVideos = safeVideos.filter(isTrailer)
  const visibleVideos = youtubeVideos.slice(0, 5)
  const featuredVideos = visibleVideos.slice(0, 2)
  const compactVideos = visibleVideos.slice(2)
  const hasMoreVideos = youtubeVideos.length > visibleVideos.length

  const modalVideos = useMemo(() => youtubeVideos, [youtubeVideos])

  return (
    <section className="py-1">
      <div className="flex items-end gap-2">
        <div className="h-7 w-1 rounded-full bg-primary" />
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="text-xl font-semibold text-white transition-colors hover:text-primary"
        >
          Videos
        </button>
        <span className="text-sm text-slate-300/80">{youtubeVideos.length}</span>
      </div>

      {youtubeVideos.length ? (
        <div className="mt-3 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {featuredVideos.map((video) => (
              <Link
                key={video.id}
                href={getYoutubeUrl(video.key)}
                target="_blank"
                rel="noreferrer"
                className="group block"
              >
                <div className="relative h-[150px] overflow-hidden rounded-xl bg-black/45 sm:h-[190px]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.03]"
                    style={{ backgroundImage: `url('${getYoutubeThumbnailUrl(video.key)}')` }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-sm text-white">
                      ▶
                    </span>
                    <span className="text-sm font-medium text-white">{video.type}</span>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-base text-slate-100">{video.name}</p>
                <p className="mt-1 text-sm text-slate-400">{getVideoLabel(video)}</p>
              </Link>
            ))}
          </div>

          {compactVideos.length > 0 && (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
              {compactVideos.map((video) => (
                <Link
                  key={video.id}
                  href={getYoutubeUrl(video.key)}
                  target="_blank"
                  rel="noreferrer"
                  className="group block"
                >
                  <div className="relative h-[86px] overflow-hidden rounded-lg bg-black/45 sm:h-[96px]">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.04]"
                      style={{ backgroundImage: `url('${getYoutubeThumbnailUrl(video.key)}')` }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                    <span className="absolute bottom-2 left-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/65 text-xs text-white">
                      ▶
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm text-slate-100">{video.name}</p>
                  <p className="mt-1 text-xs text-slate-400">{getVideoLabel(video)}</p>
                </Link>
              ))}
            </div>
          )} 

          {hasMoreVideos && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-medium uppercase tracking-wide text-slate-300 transition-colors hover:text-white"
            >
              Show all videos
            </button>
          )}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-300/80">No videos available for this movie.</p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-120 flex items-center justify-center px-4 py-8">
          <button
            type="button"
            aria-label="Close videos modal"
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <div className="relative z-10 w-full max-w-6xl overflow-hidden rounded-2xl bg-[#071022] p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-1 rounded-full bg-primary" />
                <h3 className="text-xl font-semibold text-white">All videos</h3>
                <span className="text-sm text-slate-300/80">{modalVideos.length}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white hover:bg-white/20"
              >
                Close
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {modalVideos.map((video) => (
                  <Link
                    key={`modal-${video.id}`}
                    href={getYoutubeUrl(video.key)}
                    target="_blank"
                    rel="noreferrer"
                    className="group block"
                  >
                    <div className="relative h-[140px] overflow-hidden rounded-lg bg-black/45">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.04]"
                        style={{ backgroundImage: `url('${getYoutubeThumbnailUrl(video.key)}')` }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                      <span className="absolute bottom-2 left-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/65 text-xs text-white">
                        ▶
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-100">{video.name}</p>
                    <p className="mt-1 text-xs text-slate-400">{getVideoLabel(video)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
