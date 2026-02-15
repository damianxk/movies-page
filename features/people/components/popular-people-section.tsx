"use client"

import Image from "next/image"
import Link from "next/link"
import { MovieSectionTitle } from "@/features/movies/components/movie-section-title"
import type { PopularPerson } from "@/features/people/types/popular-people"
import { getMoviePosterUrl } from "@/lib/movie-utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type PopularPeopleSectionProps = {
  people: PopularPerson[]
}

function getKnownForLabel(person: PopularPerson) {
  if (!person.known_for?.length) return "Known for unavailable"

  const titles = person.known_for
    .map((item) => item.title || item.name)
    .filter((value): value is string => Boolean(value))
    .slice(0, 2)

  if (!titles.length) return "Known for unavailable"
  return `Known for: ${titles.join(" · ")}`
}

export function PopularPeopleSection({ people }: PopularPeopleSectionProps) {
  if (!people.length) return null

  const topPeople = people.slice(0, 20)

  return (
    <section className="space-y-3 rounded-2xl border border-border/60 bg-card/30 p-4 backdrop-blur-sm">
      <MovieSectionTitle title="Popular People" count={topPeople.length} />

      <Carousel
        opts={{ align: "start", loop: false, containScroll: "trimSnaps" }}
        className="px-8"
      >
        <CarouselContent className="-ml-2">
          {topPeople.map((person) => (
            <CarouselItem
              key={person.id}
              className="pl-2 basis-[44%] sm:basis-[30%] md:basis-[23%] lg:basis-[18%] xl:basis-[14%]"
            >
              <Link
                href={`/people/${person.id}`}
                className="group block h-full overflow-hidden rounded-lg border border-border/50 bg-card/40 transition-colors hover:border-primary/60"
              >
                <div className="relative aspect-2/3 w-full">
                  <Image
                    src={getMoviePosterUrl(person.profile_path, "w500")}
                    alt={person.name}
                    fill
                    sizes="(max-width: 640px) 44vw, (max-width: 1024px) 23vw, 14vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="space-y-1 p-2.5">
                  <p className="line-clamp-1 text-sm font-semibold text-foreground">{person.name}</p>
                  <p className="text-[11px] uppercase tracking-wide text-amber-300">
                    {person.known_for_department || "Person"}
                  </p>
                  <p className="line-clamp-2 text-[11px] text-slate-300/90">{getKnownForLabel(person)}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Popularity: {person.popularity.toFixed(1)}
                  </p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1 top-[40%] border-0 bg-black/45 text-white hover:bg-black/65" />
        <CarouselNext className="right-1 top-[40%] border-0 bg-black/45 text-white hover:bg-black/65" />
      </Carousel>
    </section>
  )
}
