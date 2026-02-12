"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { type CastMember, type CrewMember } from "@/features/movies/types/movie-credits"
import { getMoviePosterUrl } from "@/lib/movie-utils"

type MovieCreditsExplorerProps = {
  cast: CastMember[]
  crew: CrewMember[]
}

function includesQuery(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase())
}

export function MovieCreditsExplorer({ cast, crew }: MovieCreditsExplorerProps) {
  const [query, setQuery] = useState("")

  const filteredCast = useMemo(() => {
    if (!query.trim()) return cast
    return cast.filter(
      (member) =>
        includesQuery(member.name, query) ||
        includesQuery(member.character || "", query),
    )
  }, [cast, query])

  const filteredCrew = useMemo(() => {
    if (!query.trim()) return crew
    return crew.filter(
      (member) =>
        includesQuery(member.name, query) ||
        includesQuery(member.job, query) ||
        includesQuery(member.department, query),
    )
  }, [crew, query])

  return (
    <>
      <div className="mb-5">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, character, job..."
          className="h-10 w-full rounded-lg bg-black/35 px-3 text-sm text-white outline-none ring-1 ring-white/15 placeholder:text-slate-400 focus:ring-primary/60"
        />
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white">Cast ({filteredCast.length})</h2>
        {filteredCast.length ? (
          <div className="mt-3 grid gap-2">
            {filteredCast.map((member) => (
              <article
                key={`${member.id}-${member.order}`}
                className="grid grid-cols-[42px_1fr] gap-2 rounded-lg bg-black/25 px-3 py-2 sm:grid-cols-[42px_1fr_1fr_auto] sm:items-center sm:gap-3"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/10">
                  <Image
                    src={getMoviePosterUrl(member.profile_path, "w500")}
                    alt={member.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-white">{member.name}</p>
                <p className="text-xs text-slate-300/85 sm:text-sm">{member.character || "Unknown role"}</p>
                <p className="text-[11px] text-slate-400 sm:text-xs">#{member.order}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-300/80">No results found for this query.</p>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">Crew ({filteredCrew.length})</h2>
        {filteredCrew.length ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {filteredCrew.map((member) => (
              <article
                key={`${member.id}-${member.job}`}
                className="rounded-lg bg-black/25 px-3 py-2"
              >
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {member.department}
                </p>
                <p className="mt-1 text-sm font-medium text-white">{member.name}</p>
                <p className="text-sm text-slate-300/85">{member.job}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-300/80">No results found for this query.</p>
        )}
      </section>
    </>
  )
}
