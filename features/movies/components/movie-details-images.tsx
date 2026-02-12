"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { type MovieBackdropImage } from "@/features/movies/types/movie-images"
import { getMovieBackdropUrl } from "@/lib/movie-utils"

type MovieDetailsImagesProps = {
  images: MovieBackdropImage[]
}

export function MovieDetailsImages({ images }: MovieDetailsImagesProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const safeImages = Array.isArray(images) ? images : []
  const sortedImages = useMemo(
    () =>
      [...safeImages]
        .sort((a, b) => b.vote_count - a.vote_count || b.vote_average - a.vote_average)
        .slice(0, 80),
    [safeImages],
  )
  const visibleImages = sortedImages.slice(0, 5)
  const remainingCount = Math.max(0, sortedImages.length - visibleImages.length)

  useEffect(() => {
    if (activeIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null)
      if (event.key === "ArrowRight") {
        setActiveIndex((prev) => {
          if (prev === null || sortedImages.length === 0) return prev
          return (prev + 1) % sortedImages.length
        })
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((prev) => {
          if (prev === null || sortedImages.length === 0) return prev
          return (prev - 1 + sortedImages.length) % sortedImages.length
        })
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [activeIndex, sortedImages.length])

  const activeImage = activeIndex !== null ? sortedImages[activeIndex] : null

  return (
    <section id="images" className="scroll-mt-32 py-1">
      <div className="flex items-end gap-2">
        <div className="h-7 w-1 rounded-full bg-primary" />
        <h2 className="text-xl font-semibold text-white">Photos</h2>
        <span className="text-sm text-slate-300/80">{sortedImages.length}</span>
      </div>

      {visibleImages.length ? (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {visibleImages.slice(0, 2).map((image, index) => (
              <button
                type="button"
                key={`top-${image.file_path}`}
                onClick={() => setActiveIndex(index)}
                className="group relative h-[120px] overflow-hidden rounded-xl bg-black/40 sm:h-[140px]"
              >
                <Image
                  src={getMovieBackdropUrl(image.file_path)}
                  alt={`Movie image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 30vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {visibleImages.slice(2).map((image, index) => {
              const absoluteIndex = index + 2
              const isLastVisible = absoluteIndex === visibleImages.length - 1 && remainingCount > 0

              return (
                <button
                  type="button"
                  key={`bottom-${image.file_path}`}
                  onClick={() => setActiveIndex(absoluteIndex)}
                  className="group relative h-[82px] overflow-hidden rounded-lg bg-black/40 sm:h-[90px]"
                >
                  <Image
                    src={getMovieBackdropUrl(image.file_path)}
                    alt={`Movie image ${absoluteIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {isLastVisible && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-lg font-semibold text-white">
                      +{remainingCount}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-300/80">No images available for this movie.</p>
      )}

      {activeImage && activeIndex !== null && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/90"
          style={{ zIndex: 1000 }}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
          >
            Close
          </button>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-xs text-slate-200">
            Zdjęcie {activeIndex + 1} z {sortedImages.length}
          </div>

          <button
            type="button"
            onClick={() =>
              setActiveIndex((prev) =>
                prev === null ? null : (prev - 1 + sortedImages.length) % sortedImages.length,
              )
            }
            className="absolute left-3 rounded bg-black/45 px-2 py-3 text-sm text-white hover:bg-black/70"
          >
            {"<"}
          </button>

          <div className="relative h-[70vh] w-[92vw] max-w-6xl overflow-hidden rounded-lg">
            <Image
              src={getMovieBackdropUrl(activeImage.file_path)}
              alt={`Movie fullscreen image ${activeIndex + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-xs text-slate-200">
            {activeIndex + 1} / {sortedImages.length}
          </div>

          <button
            type="button"
            onClick={() =>
              setActiveIndex((prev) =>
                prev === null ? null : (prev + 1) % sortedImages.length,
              )
            }
            className="absolute right-3 rounded bg-black/45 px-2 py-3 text-sm text-white hover:bg-black/70"
          >
            {">"}
          </button>
        </div>
      )}
    </section>
  )
}
