import Link from "next/link"

type MovieSectionTitleProps = {
  title: string
  count?: number
  href?: string
  onClick?: () => void
}

export function MovieSectionTitle({
  title,
  count,
  href,
  onClick,
}: MovieSectionTitleProps) {
  return (
    <div className="flex items-end gap-2">
      <div className="h-7 w-1 rounded-full bg-primary" />
      {href ? (
        <Link
          href={href}
          className="text-xl font-semibold text-white transition-colors hover:text-primary"
        >
          {title}
        </Link>
      ) : onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="text-xl font-semibold text-white transition-colors hover:text-primary"
        >
          {title}
        </button>
      ) : (
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      )}
      {typeof count === "number" && (
        <span className="text-sm text-slate-300/80">{count}</span>
      )}
    </div>
  )
}
