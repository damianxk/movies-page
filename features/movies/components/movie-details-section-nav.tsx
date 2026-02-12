const SECTION_LINKS = [
  { id: "overview", label: "Overview" },
  { id: "cast", label: "Cast" },
  { id: "crew", label: "Crew" },
  { id: "media", label: "Media" },
  { id: "recommendations", label: "Similar" },
  { id: "details", label: "Details" },
]

export function MovieDetailsSectionNav() {
  return (
    <nav className="sticky top-20 z-20 w-full overflow-x-auto rounded-xl border border-white/10 bg-[#0b1223]/70 px-3 py-2 backdrop-blur-md">
      <ul className="flex min-w-max items-center gap-2">
        {SECTION_LINKS.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="block rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
