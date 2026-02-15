import {
  Facebook01Icon,
  InstagramIcon,
  TwitterIcon,
} from "@hugeicons/core-free-icons"

export type NavLinkItem = {
  label: string
  href: string
  active?: boolean
}

export const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "Series", href: "/series" },
  // { label: "New & Popular", href: "/new" },
]

export const SOCIAL_ICONS = [InstagramIcon, TwitterIcon, Facebook01Icon]
