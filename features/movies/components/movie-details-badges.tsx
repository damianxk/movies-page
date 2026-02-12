type MovieDetailsBadgesProps = {
  title: string
  items: string[]
}

export function MovieDetailsBadges({ title, items }: MovieDetailsBadgesProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b1223]/75 p-5 backdrop-blur-md sm:p-6">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <span
              key={item}
              className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-100"
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
