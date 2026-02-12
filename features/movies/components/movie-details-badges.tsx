type MovieDetailsBadgesProps = {
  title: string
  items: string[]
}

export function MovieDetailsBadges({ title, items }: MovieDetailsBadgesProps) {
  return (
    <section className="py-2">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <span
              key={item}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-100"
            >
              {item}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-300/80">No data</p>
        )}
      </div>
    </section>
  )
}
