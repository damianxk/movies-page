"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { type MovieVideo } from "@/features/movies/types/movie-videos"
import { MovieSectionTitle } from "@/features/movies/components/movie-section-title"

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
  const mobileVisibleVideos = youtubeVideos.slice(0, 1)
  const visibleVideos = youtubeVideos.slice(0, 5)
  const featuredVideos = visibleVideos.slice(0, 2)
  const compactVideos = visibleVideos.slice(2)
  const hasMoreVideos = youtubeVideos.length > visibleVideos.length

  const modalVideos = useMemo(() => youtubeVideos, [youtubeVideos])

  return (
    <section className="py-1">
      <MovieSectionTitle
        title="Videos"
        count={youtubeVideos.length}
        onClick={() => setIsModalOpen(true)}
      />

      {youtubeVideos.length ? (
        <div className="mt-3 space-y-4">
          <div className="sm:hidden">
            {mobileVisibleVideos.map((video) => (
              <Link
                key={`mobile-${video.id}`}
                href={getYoutubeUrl(video.key)}
                target="_blank"
                rel="noreferrer"
                className="group block"
              >
                <div className="relative h-[186px] overflow-hidden rounded-xl bg-black/45">
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
                <p className="mt-2 line-clamp-2 text-sm text-slate-100 sm:text-base">{video.name}</p>
                <p className="mt-1 text-sm text-slate-400">{getVideoLabel(video)}</p>
              </Link>
            ))}
          </div>

          <div className="hidden sm:block">
            <div className="grid gap-3 sm:grid-cols-2">
              {featuredVideos.map((video) => (
                <Link
                  key={video.id}
                  href={getYoutubeUrl(video.key)}
                  target="_blank"
                  rel="noreferrer"
                  className="group block"
                >
                  <div className="relative h-[168px] overflow-hidden rounded-xl bg-black/45 sm:h-[180px] lg:h-[190px]">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.04]"
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
                  <p className="mt-2 line-clamp-2 text-sm text-slate-100 sm:text-base">{video.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{getVideoLabel(video)}</p>
                </Link>
              ))}
            </div>

            {compactVideos.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
                {compactVideos.map((video) => (
                  <Link
                    key={`compact-${video.id}`}
                    href={getYoutubeUrl(video.key)}
                    target="_blank"
                    rel="noreferrer"
                    className="group block"
                  >
                    <div className="relative h-[92px] overflow-hidden rounded-lg bg-black/45 sm:h-[104px]">
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
          </div>

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
        <div className="fixed inset-0 z-120 flex items-center justify-center px-3 py-6 sm:px-4 sm:py-8">
          <button
            type="button"
            aria-label="Close videos modal"
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <div className="relative z-10 flex w-full max-w-6xl max-h-[84vh] flex-col overflow-hidden rounded-2xl bg-[#071022] p-4 sm:max-h-[76vh] sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-1 rounded-full bg-primary" />
                <h3 className="text-lg font-semibold text-white sm:text-xl">All videos</h3>
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

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
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
