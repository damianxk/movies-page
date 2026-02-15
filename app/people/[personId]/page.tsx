import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MovieSectionTitle } from "@/features/movies/components/movie-section-title"
import { getMoviePosterUrl } from "@/lib/movie-utils"
import { getPersonDetails } from "@/features/people/server/get-person-details"
import { getPersonCombinedCredits } from "@/features/people/server/get-person-combined-credits"
import { getPersonImages } from "@/features/people/server/get-person-images"
import { getPersonMovieCredits } from "@/features/people/server/get-person-movie-credits"
import { getPersonTvCredits } from "@/features/people/server/get-person-tv-credits"
import { PersonDetailsImages } from "@/features/people/components/person-details-images"
import type {
  PersonCastCredit,
  PersonCrewCredit,
  PersonMediaType,
} from "@/features/people/types/person-credits"

type PersonDetailsPageProps = {
  params: Promise<{ personId: string }>
}

type CreditItem = PersonCastCredit | PersonCrewCredit

function toPersonId(value: string) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) return null
  return parsed
}

function toMediaType(credit: CreditItem, fallback: PersonMediaType): PersonMediaType {
  if (credit.media_type === "movie" || credit.media_type === "tv") return credit.media_type
  if ("first_air_date" in credit && credit.first_air_date) return "tv"
  if ("name" in credit && credit.name && !("title" in credit && credit.title)) return "tv"
  return fallback
}

function getCreditTitle(credit: CreditItem) {
  if ("title" in credit && credit.title) return credit.title
  if ("name" in credit && credit.name) return credit.name
  if ("original_title" in credit && credit.original_title) return credit.original_title
  if ("original_name" in credit && credit.original_name) return credit.original_name
  return "Untitled"
}

function getCreditDate(credit: CreditItem) {
  if ("release_date" in credit && credit.release_date) return credit.release_date
  if ("first_air_date" in credit && credit.first_air_date) return credit.first_air_date
  return ""
}

function getCreditMeta(credit: CreditItem) {
  if ("character" in credit && credit.character) return credit.character
  if ("job" in credit && credit.job) return `${credit.job}${credit.department ? ` (${credit.department})` : ""}`
  return ""
}

function formatDate(value: string | null) {
  if (!value) return "Unknown"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Unknown"
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatGender(value: number) {
  if (value === 1) return "Female"
  if (value === 2) return "Male"
  if (value === 3) return "Non-binary"
  return "Unknown"
}

function uniqByCredit(items: CreditItem[]) {
  const map = new Map<string, CreditItem>()
  for (const item of items) {
    const key = `${item.id}-${item.credit_id}`
    if (!map.has(key)) map.set(key, item)
  }
  return Array.from(map.values())
}

function sortCredits(items: CreditItem[]) {
  return items.sort((a, b) => {
    const popularityDiff = (b.popularity ?? 0) - (a.popularity ?? 0)
    if (popularityDiff !== 0) return popularityDiff
    return (b.vote_count ?? 0) - (a.vote_count ?? 0)
  })
}

export async function generateMetadata({ params }: PersonDetailsPageProps): Promise<Metadata> {
  const { personId } = await params
  const parsedPersonId = toPersonId(personId)

  if (!parsedPersonId) {
    return { title: "Person" }
  }

  const person = await getPersonDetails(parsedPersonId)
  return { title: person?.name || "Person" }
}

function CreditsTable({
  title,
  credits,
  fallbackMediaType,
}: {
  title: string
  credits: CreditItem[]
  fallbackMediaType: PersonMediaType
}) {
  const topCredits = sortCredits(uniqByCredit(credits)).slice(0, 40)

  if (topCredits.length === 0) return null

  return (
    <section className="space-y-3">
      <MovieSectionTitle title={title} count={topCredits.length} />
      <div className="overflow-x-auto rounded-xl border border-border/50 bg-black/20">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-border/50 bg-black/30 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-3 py-2 font-medium">Title</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Role / Job</th>
              <th className="px-3 py-2 font-medium">Year</th>
              <th className="px-3 py-2 font-medium text-right">Rating</th>
            </tr>
          </thead>
          <tbody>
            {topCredits.map((credit) => {
              const mediaType = toMediaType(credit, fallbackMediaType)
              const href = mediaType === "movie" ? `/movies/${credit.id}` : `/series/${credit.id}`
              const titleText = getCreditTitle(credit)
              const meta = getCreditMeta(credit)
              const year = getCreditDate(credit).split("-")[0] || "Unknown"
              const rating = Number.isFinite(credit.vote_average)
                ? credit.vote_average.toFixed(1)
                : "-"

              return (
                <tr
                  key={`${credit.id}-${credit.credit_id}-${titleText}`}
                  className="border-b border-border/30 last:border-b-0"
                >
                  <td className="px-3 py-2">
                    <Link href={href} className="font-medium text-white transition-colors hover:text-primary">
                      {titleText}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-slate-300">{mediaType === "movie" ? "Movie" : "TV"}</td>
                  <td className="px-3 py-2 text-slate-300">{meta || "-"}</td>
                  <td className="px-3 py-2 text-slate-400">{year}</td>
                  <td className="px-3 py-2 text-right text-slate-300">{rating}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default async function PersonDetailsPage({ params }: PersonDetailsPageProps) {
  const { personId } = await params
  const parsedPersonId = toPersonId(personId)
  if (!parsedPersonId) notFound()

  const [person, combinedCredits, images, movieCredits, tvCredits] = await Promise.all([
    getPersonDetails(parsedPersonId),
    getPersonCombinedCredits(parsedPersonId),
    getPersonImages(parsedPersonId),
    getPersonMovieCredits(parsedPersonId),
    getPersonTvCredits(parsedPersonId),
  ])

  if (!person) notFound()

  const profileUrl = getMoviePosterUrl(person.profile_path, "w500")
  const profileImages = images?.profiles ?? []

  return (
    <main className="relative min-h-svh w-full overflow-hidden bg-[#030711]">
      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[1640px] flex-col gap-5 overflow-x-clip px-4 pb-6 pt-24 sm:px-6 lg:px-10 lg:pb-8 xl:px-12">
        <section className="grid gap-5 rounded-2xl border border-border/60 bg-card/30 p-4 backdrop-blur-sm md:grid-cols-[280px_minmax(0,1fr)] md:p-5">
          <div className="relative mx-auto aspect-2/3 w-full max-w-[280px] overflow-hidden rounded-xl border border-border/60 bg-black/40">
            <Image
              src={profileUrl}
              alt={person.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 70vw, 280px"
              priority
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-white md:text-3xl">{person.name}</h1>
              <p className="text-sm text-slate-300">{person.known_for_department || "Person"}</p>
            </div>

            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <p className="text-slate-300">
                <span className="text-slate-400">Birthday:</span> {formatDate(person.birthday)}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">Deathday:</span> {formatDate(person.deathday)}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">Place of birth:</span>{" "}
                {person.place_of_birth || "Unknown"}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">Gender:</span> {formatGender(person.gender)}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">Popularity:</span>{" "}
                {person.popularity.toFixed(2)}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">TMDB id:</span> {person.id}
              </p>
              {person.imdb_id ? (
                <p className="text-slate-300 sm:col-span-2">
                  <span className="text-slate-400">IMDB:</span> {person.imdb_id}
                </p>
              ) : null}
            </div>

            {person.biography ? (
              <div className="space-y-2">
                <MovieSectionTitle title="Biography" />
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-200/95">
                  {person.biography}
                </p>
              </div>
            ) : null}
          </div>
        </section>

        {person.also_known_as.length > 0 ? (
          <section className="space-y-3 rounded-2xl border border-border/60 bg-card/30 p-4 backdrop-blur-sm">
            <MovieSectionTitle title="Also known as" count={person.also_known_as.length} />
            <div className="flex flex-wrap gap-2">
              {person.also_known_as.map((alias) => (
                <span
                  key={alias}
                  className="rounded-full border border-border/60 bg-black/20 px-3 py-1 text-xs text-slate-200"
                >
                  {alias}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <PersonDetailsImages images={profileImages} personName={person.name} />

        <div className="space-y-5 rounded-2xl border border-border/60 bg-card/30 p-4 backdrop-blur-sm">
          <CreditsTable
            title="Known for (combined credits)"
            credits={[
              ...(combinedCredits?.cast ?? []),
              ...(combinedCredits?.crew ?? []),
            ]}
            fallbackMediaType="movie"
          />
          <CreditsTable
            title="Movie credits"
            credits={[...(movieCredits?.cast ?? []), ...(movieCredits?.crew ?? [])]}
            fallbackMediaType="movie"
          />
          <CreditsTable
            title="TV credits"
            credits={[...(tvCredits?.cast ?? []), ...(tvCredits?.crew ?? [])]}
            fallbackMediaType="tv"
          />
        </div>
      </div>
    </main>
  )
}
