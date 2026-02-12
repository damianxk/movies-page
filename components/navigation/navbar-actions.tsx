"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { MobileMenu } from "@/components/mobile-menu"
import { type NavLinkItem } from "./nav-config"

type NavbarActionsProps = {
  links: NavLinkItem[]
  onOpenSearch: () => void
}

export const NavbarActions = ({ links, onOpenSearch }: NavbarActionsProps) => {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={onOpenSearch}
        className="rounded-full hover:bg-white/10 text-muted-foreground hover:text-white"
      >
        <HugeiconsIcon icon={Search01Icon} size={20} />
      </Button>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full hover:bg-white/10 text-foreground transition-colors"
          >
            <HugeiconsIcon icon={Menu01Icon} size={24} />
          </Button>
        </SheetTrigger>
        <MobileMenu links={links} />
      </Sheet>
    </div>
  )
}
