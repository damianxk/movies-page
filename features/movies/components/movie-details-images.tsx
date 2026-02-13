"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { type MovieBackdropImage } from "@/features/movies/types/movie-images"
import { getMovieBackdropUrl } from "@/lib/movie-utils"
import { MovieSectionTitle } from "@/features/movies/components/movie-section-title"

type MovieDetailsImagesProps = {
  images: MovieBackdropImage[]
}

export function MovieDetailsImages({ images }: MovieDetailsImagesProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)

  const safeImages = Array.isArray(images) ? images : []
  const sortedImages = useMemo(
    () =>
      [...safeImages]
        .sort((a, b) => b.vote_count - a.vote_count || b.vote_average - a.vote_average)
        .slice(0, 80),
    [safeImages],
  )
  const mobileVisibleImages = sortedImages.slice(0, 3)
  const visibleImages = sortedImages.slice(0, 5)
  const mobileRemainingCount = Math.max(0, sortedImages.length - mobileVisibleImages.length)
  const remainingCount = Math.max(0, sortedImages.length - visibleImages.length)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (activeIndex === null) {
      setIsImageLoading(false)
      return
    }
    setIsImageLoading(true)
  }, [activeIndex])

  const openImageAtIndex = (index: number) => {
    setIsImageLoading(true)
    setActiveIndex(index)
  }

  const navigateImage = (direction: "prev" | "next") => {
    if (sortedImages.length === 0) return
    setIsImageLoading(true)
    setActiveIndex((prev) => {
      if (prev === null) return null
      if (direction === "prev") {
        return (prev - 1 + sortedImages.length) % sortedImages.length
      }
      return (prev + 1) % sortedImages.length
    })
  }

  useEffect(() => {
    if (activeIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null)
      if (event.key === "ArrowRight") {
        navigateImage("next")
      }
      if (event.key === "ArrowLeft") {
        navigateImage("prev")
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
      <MovieSectionTitle title="Photos" count={sortedImages.length} />

      {visibleImages.length ? (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-2 sm:hidden">
            {mobileVisibleImages.map((image, index) => {
              const isHeroImage = index === 0
              const isLastMobileVisible =
                index === mobileVisibleImages.length - 1 && mobileRemainingCount > 0

              return (
                <button
                  type="button"
                  key={`mobile-image-${image.file_path}`}
                  onClick={() => openImageAtIndex(index)}
                  className={[
                    "group relative overflow-hidden bg-black/40",
                    isHeroImage ? "col-span-2 h-[164px] rounded-xl" : "h-[96px] rounded-lg",
                  ].join(" ")}
                >
                  <Image
                    src={getMovieBackdropUrl(image.file_path)}
                    alt={`Movie image ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {isLastMobileVisible && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-lg font-semibold text-white">
                      +{mobileRemainingCount}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <div className="hidden grid-cols-2 gap-3 sm:grid">
            {visibleImages.map((image, index) => {
              const isHeroImage = index === 0
              const isLastVisible = index === visibleImages.length - 1 && remainingCount > 0

              return (
                <button
                  type="button"
                  key={`image-${image.file_path}`}
                  onClick={() => openImageAtIndex(index)}
                  className={[
                    "group relative overflow-hidden bg-black/40",
                    isHeroImage
                      ? "col-span-2 h-[184px] rounded-xl md:h-[208px]"
                      : "h-[104px] rounded-lg md:h-[116px]",
                  ].join(" ")}
                >
                  <Image
                    src={getMovieBackdropUrl(image.file_path)}
                    alt={`Movie image ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 33vw, 20vw"
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

      {isMounted &&
        activeImage &&
        activeIndex !== null &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/90"
            style={{ zIndex: 2147483647 }}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-4 top-4 z-20 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
            >
              Close
            </button>

            <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-xs text-slate-200">
              Image {activeIndex + 1} of {sortedImages.length}
            </div>

            <div className="relative h-[70vh] w-[96vw] max-w-6xl overflow-hidden rounded-lg md:w-[92vw]">
              {isImageLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/45">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                </div>
              )}
              <Image
                key={activeImage.file_path}
                src={getMovieBackdropUrl(activeImage.file_path)}
                alt={`Movie fullscreen image ${activeIndex + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
                onLoad={() => setIsImageLoading(false)}
              />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-xs text-slate-200">
              {activeIndex + 1} / {sortedImages.length}
            </div>

            <button
              type="button"
              aria-label="Previous image"
              onClick={() => navigateImage("prev")}
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-md bg-black/55 px-2.5 py-3 text-sm text-white hover:bg-black/75 md:left-4"
            >
              {"<"}
            </button>

            <button
              type="button"
              aria-label="Next image"
              onClick={() => navigateImage("next")}
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-md bg-black/55 px-2.5 py-3 text-sm text-white hover:bg-black/75 md:right-4"
            >
              {">"}
            </button>
          </div>,
          document.body,
        )}
    </section>
  )
}
