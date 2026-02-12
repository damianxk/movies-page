import Link from "next/link"

export const NavLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        M
      </div>
      <span className="text-xl font-bold tracking-tight text-foreground/90 group-hover:text-foreground transition-colors uppercase">
        Movie page
      </span>
    </Link>
  )
}
