import Link from "next/link"
import { type NavLinkItem } from "./nav-config"

type DesktopNavProps = {
  links: NavLinkItem[]
}

export const DesktopNav = ({ links }: DesktopNavProps) => {
  return (
    <nav className="hidden md:flex items-center gap-8 bg-black/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/5 shadow-lg">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="text-sm font-medium text-muted-foreground hover:text-white transition-colors relative"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
