"use client"

import Image from "next/image"
import Link from "next/link"
import { type Series } from "@/types/series"
import { getMoviePosterUrl } from "@/lib/movie-utils"
import { MovieSectionTitle } from "@/features/movies/components/movie-section-title"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type SeriesDetailsListCarouselProps = {
  title: string
  items: Series[]
}

export function SeriesDetailsListCarousel({ title, items }: SeriesDetailsListCarouselProps) {
  const safeItems = Array.isArray(items) ? items : []
  const visibleItems = safeItems.slice(0, 16)

  return (
    <section className="py-1">
      <MovieSectionTitle title={title} count={visibleItems.length} />

      {visibleItems.length ? (
        <Carousel
          opts={{
            align: "start",
            loop: false,
            containScroll: "trimSnaps",
          }}
          className="mt-2 overflow-hidden px-7"
        >
          <CarouselContent className="-ml-2">
            {visibleItems.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-2 basis-[34%] sm:basis-[24%] lg:basis-[19%] xl:basis-[16%]"
              >
                <Link href={`/series/${item.id}`} className="group block overflow-hidden rounded-lg bg-black/25">
                  <div className="relative aspect-2/3 w-full overflow-hidden">
                    <Image
                      src={getMoviePosterUrl(item.poster_path, "w500")}
                      alt={item.name}
                      fill
                      sizes="(max-width: 1280px) 30vw, 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-1.5">
                    <p className="truncate text-[10px] font-medium text-white">{item.name}</p>
                    <p className="mt-1 text-[10px] text-slate-300/80">
                      {item.first_air_date?.split("-")[0] || "Unknown"}
                    </p>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1 top-[40%] border-0 bg-black/45 text-white hover:bg-black/65" />
          <CarouselNext className="right-1 top-[40%] border-0 bg-black/45 text-white hover:bg-black/65" />
        </Carousel>
      ) : (
        <p className="mt-4 text-sm text-slate-300/80">No items available.</p>
      )}
    </section>
  )
}
