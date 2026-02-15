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
  searchParams: Promise<{ tab?: string | string[]; cp?: string | string[] }>
}

type CreditItem = PersonCastCredit | PersonCrewCredit
type CreditsTab = "combined" | "movies" | "series"

function toPersonId(value: string) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) return null
  return parsed
}

function toCreditsTab(value?: string | string[]): CreditsTab {
  const source = Array.isArray(value) ? value[0] : value
  if (source === "movies") return "movies"
  if (source === "series") return "series"
  return "combined"
}

function toSafePage(value?: string | string[]) {
  const source = Array.isArray(value) ? value[0] : value
  const parsed = Number(source)
  if (!Number.isInteger(parsed) || parsed <= 0) return 1
  return parsed
}

function buildCreditsHref(personId: number, tab: CreditsTab, page: number) {
  const params = new URLSearchParams()
  if (tab !== "combined") params.set("tab", tab)
  if (page > 1) params.set("cp", String(page))
  const query = params.toString()
  return query ? `/people/${personId}?${query}` : `/people/${personId}`
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

function getCreditOriginalTitle(credit: CreditItem) {
  if ("original_title" in credit && credit.original_title) return credit.original_title
  if ("original_name" in credit && credit.original_name) return credit.original_name
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
    const mediaType = item.media_type ?? ("title" in item ? "movie" : "tv")
    const key = `${item.id}-${mediaType}-${item.credit_id}`
    if (!map.has(key)) map.set(key, item)
  }
  return Array.from(map.values())
}

function sortCredits(items: CreditItem[]) {
  return items.sort((a, b) => {
    const dateA = Date.parse(getCreditDate(a))
    const dateB = Date.parse(getCreditDate(b))
    const normalizedA = Number.isNaN(dateA) ? 0 : dateA
    const normalizedB = Number.isNaN(dateB) ? 0 : dateB
    const dateDiff = normalizedB - normalizedA
    if (dateDiff !== 0) return dateDiff

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
  personId,
  activeTab,
  currentPage,
  title,
  credits,
  fallbackMediaType,
}: {
  personId: number
  activeTab: CreditsTab
  currentPage: number
  title: string
  credits: CreditItem[]
  fallbackMediaType: PersonMediaType
}) {
  const pageSize = 20
  const sortedCredits = sortCredits(uniqByCredit(credits))
  const totalItems = sortedCredits.length

  if (totalItems === 0) return null

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const page = Math.min(currentPage, totalPages)
  const from = (page - 1) * pageSize
  const pageCredits = sortedCredits.slice(from, from + pageSize)
  const prevHref = buildCreditsHref(personId, activeTab, page - 1)
  const nextHref = buildCreditsHref(personId, activeTab, page + 1)

  return (
    <section className="space-y-3 rounded-2xl border border-border/60 bg-card/30 p-4 backdrop-blur-sm">
      <MovieSectionTitle title={title} count={totalItems} />
      <div className="overflow-hidden rounded-xl border border-border/50 bg-black/20">
        {pageCredits.map((credit) => {
          const mediaType = toMediaType(credit, fallbackMediaType)
          const href = mediaType === "movie" ? `/movies/${credit.id}` : `/series/${credit.id}`
          const titleText = getCreditTitle(credit)
          const originalTitle = getCreditOriginalTitle(credit)
          const meta = getCreditMeta(credit)
          const date = getCreditDate(credit)
          const year = date.split("-")[0] || "----"
          const rating = Number.isFinite(credit.vote_average) ? credit.vote_average.toFixed(1) : "-"
          const posterUrl = getMoviePosterUrl(credit.poster_path, "w500")

          return (
            <article
              key={`${credit.id}-${credit.credit_id}-${titleText}-${mediaType}`}
              className="grid grid-cols-[62px_minmax(0,1fr)] gap-3 border-b border-border/35 p-3 last:border-b-0 md:grid-cols-[74px_minmax(0,1fr)] md:gap-4"
            >
              <p className="pt-1 text-2xl font-semibold leading-none text-slate-300">{year}</p>

              <div className="flex min-w-0 gap-3">
                <Link
                  href={href}
                  className="group relative block h-[128px] w-[88px] shrink-0 overflow-hidden rounded-md border border-border/60 bg-black/30"
                >
                  <Image
                    src={posterUrl}
                    alt={titleText}
                    fill
                    sizes="88px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs leading-none text-black">
                    ★
                  </span>
                </Link>

                <div className="min-w-0 space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-300">
                    {mediaType === "movie" ? "Movie" : "TV"}
                  </p>
                  <Link href={href} className="line-clamp-2 text-2xl leading-tight text-white hover:text-primary">
                    {titleText}
                  </Link>
                  {originalTitle && originalTitle !== titleText ? (
                    <p className="line-clamp-1 text-lg leading-tight text-slate-300">{originalTitle}</p>
                  ) : null}
                  <p className="line-clamp-2 text-lg text-slate-200/90">{meta || "Role / job unavailable"}</p>
                  <p className="text-sm text-slate-400">
                    Rating: {rating} / 10
                    {date ? ` · Date: ${date}` : ""}
                  </p>
                </div>
              </div>
            </article>
          )
        })}
      </div>
      <div className="flex items-center justify-between gap-3 text-sm text-slate-300">
        <p>
          Page {page} / {totalPages}
        </p>
        <div className="flex items-center gap-2">
          {page > 1 ? (
            <Link
              href={prevHref}
              scroll={false}
              className="rounded-md bg-black/30 px-3 py-1.5 text-slate-200 transition-colors hover:bg-black/45"
            >
              Previous
            </Link>
          ) : (
            <span className="rounded-md bg-black/15 px-3 py-1.5 text-slate-500">Previous</span>
          )}
          {page < totalPages ? (
            <Link
              href={nextHref}
              scroll={false}
              className="rounded-md bg-black/30 px-3 py-1.5 text-slate-200 transition-colors hover:bg-black/45"
            >
              Next
            </Link>
          ) : (
            <span className="rounded-md bg-black/15 px-3 py-1.5 text-slate-500">Next</span>
          )}
        </div>
      </div>
    </section>
  )
}

export default async function PersonDetailsPage({ params, searchParams }: PersonDetailsPageProps) {
  const { personId } = await params
  const parsedSearchParams = await searchParams
  const parsedPersonId = toPersonId(personId)
  if (!parsedPersonId) notFound()

  const activeTab = toCreditsTab(parsedSearchParams.tab)
  const creditsPage = toSafePage(parsedSearchParams.cp)

  const [person, images, creditsData] = await Promise.all([
    getPersonDetails(parsedPersonId),
    getPersonImages(parsedPersonId),
    activeTab === "movies"
      ? getPersonMovieCredits(parsedPersonId)
      : activeTab === "series"
        ? getPersonTvCredits(parsedPersonId)
        : getPersonCombinedCredits(parsedPersonId),
  ])

  if (!person) notFound()

  const profileUrl = getMoviePosterUrl(person.profile_path, "w500")
  const profileImages = images?.profiles ?? []
  const creditsTitle =
    activeTab === "movies"
      ? "Filmography - movies"
      : activeTab === "series"
        ? "Filmography - TV series"
        : "Filmography - combined"

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

        <div className="space-y-5">
          <section className="rounded-2xl border border-border/60 bg-card/30 p-2 backdrop-blur-sm">
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildCreditsHref(person.id, "combined", 1)}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  activeTab === "combined"
                    ? "bg-primary text-primary-foreground"
                    : "bg-black/30 text-slate-200 hover:bg-black/45"
                }`}
              >
                Combined
              </Link>
              <Link
                href={buildCreditsHref(person.id, "movies", 1)}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  activeTab === "movies"
                    ? "bg-primary text-primary-foreground"
                    : "bg-black/30 text-slate-200 hover:bg-black/45"
                }`}
              >
                Movies
              </Link>
              <Link
                href={buildCreditsHref(person.id, "series", 1)}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  activeTab === "series"
                    ? "bg-primary text-primary-foreground"
                    : "bg-black/30 text-slate-200 hover:bg-black/45"
                }`}
              >
                Series
              </Link>
            </div>
          </section>

          <CreditsTable
            personId={person.id}
            activeTab={activeTab}
            currentPage={creditsPage}
            title={creditsTitle}
            credits={[...(creditsData?.cast ?? []), ...(creditsData?.crew ?? [])]}
            fallbackMediaType={activeTab === "series" ? "tv" : "movie"}
          />
        </div>
      </div>
    </main>
  )
}
