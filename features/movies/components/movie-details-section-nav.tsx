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
    <nav className="sticky top-20 z-20 w-full overflow-x-auto bg-black/20 py-0.5 backdrop-blur-sm">
      <ul className="flex min-w-max items-center gap-1.5">
        {SECTION_LINKS.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="block rounded-full px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
