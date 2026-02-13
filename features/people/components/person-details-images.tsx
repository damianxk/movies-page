"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { MovieSectionTitle } from "@/features/movies/components/movie-section-title"
import type { PersonProfileImage } from "@/features/people/types/person-images"
import { getMoviePosterUrl } from "@/lib/movie-utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type PersonDetailsImagesProps = {
  images: PersonProfileImage[]
  personName: string
}

export function PersonDetailsImages({ images, personName }: PersonDetailsImagesProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)

  const sortedImages = useMemo(
    () =>
      [...(Array.isArray(images) ? images : [])]
        .sort((a, b) => b.vote_count - a.vote_count || b.vote_average - a.vote_average)
        .slice(0, 40),
    [images]
  )

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

  useEffect(() => {
    if (activeIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null)
      if (event.key === "ArrowRight") {
        setIsImageLoading(true)
        setActiveIndex((prev) =>
          prev === null ? null : (prev + 1) % sortedImages.length
        )
      }
      if (event.key === "ArrowLeft") {
        setIsImageLoading(true)
        setActiveIndex((prev) =>
          prev === null ? null : (prev - 1 + sortedImages.length) % sortedImages.length
        )
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

  if (!sortedImages.length) {
    return (
      <section className="space-y-3 rounded-2xl border border-border/60 bg-card/30 p-4 backdrop-blur-sm">
        <MovieSectionTitle title="Photos" count={0} />
        <p className="text-sm text-slate-300/80">No photos available for this person.</p>
      </section>
    )
  }

  return (
    <section className="space-y-3 rounded-2xl border border-border/60 bg-card/30 p-4 backdrop-blur-sm">
      <MovieSectionTitle title="Photos" count={sortedImages.length} />

      <Carousel
        opts={{
          align: "start",
          loop: false,
          containScroll: "trimSnaps",
        }}
        className="overflow-hidden px-8"
      >
        <CarouselContent className="-ml-2">
          {sortedImages.map((image, index) => (
            <CarouselItem
              key={image.file_path}
              className="pl-2 basis-[44%] sm:basis-[30%] lg:basis-[20%] xl:basis-[16%]"
            >
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group relative block aspect-2/3 w-full overflow-hidden rounded-lg border border-border/50 bg-black/30"
              >
                <Image
                  src={getMoviePosterUrl(image.file_path, "w500")}
                  alt={`${personName} photo ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 16vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1 top-[40%] border-0 bg-black/45 text-white hover:bg-black/65" />
        <CarouselNext className="right-1 top-[40%] border-0 bg-black/45 text-white hover:bg-black/65" />
      </Carousel>

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
              Photo {activeIndex + 1} of {sortedImages.length}
            </div>

            <div className="relative h-[78vh] w-[94vw] max-w-4xl overflow-hidden rounded-lg md:w-[88vw]">
              {isImageLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/45">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                </div>
              )}
              <Image
                key={activeImage.file_path}
                src={getMoviePosterUrl(activeImage.file_path)}
                alt={`${personName} fullscreen photo ${activeIndex + 1}`}
                fill
                sizes="88vw"
                className="object-contain"
                onLoad={() => setIsImageLoading(false)}
              />
            </div>

            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => {
                setIsImageLoading(true)
                setActiveIndex((prev) =>
                  prev === null ? null : (prev - 1 + sortedImages.length) % sortedImages.length
                )
              }}
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-md bg-black/55 px-2.5 py-3 text-sm text-white hover:bg-black/75 md:left-4"
            >
              {"<"}
            </button>

            <button
              type="button"
              aria-label="Next photo"
              onClick={() => {
                setIsImageLoading(true)
                setActiveIndex((prev) =>
                  prev === null ? null : (prev + 1) % sortedImages.length
                )
              }}
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-md bg-black/55 px-2.5 py-3 text-sm text-white hover:bg-black/75 md:right-4"
            >
              {">"}
            </button>
          </div>,
          document.body
        )}
    </section>
  )
}
