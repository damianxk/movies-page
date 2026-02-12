// @/components/custom-ui/mobile-menu.tsx
"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { SOCIAL_ICONS, type NavLinkItem } from "@/components/navigation/nav-config"

type MobileMenuProps = {
    links: NavLinkItem[]
}

export const MobileMenu = ({ links }: MobileMenuProps) => {
    return (
        <SheetContent
            side="right"
            className="w-[85vw] sm:w-[400px] border-l-white/10 bg-zinc-950/95 backdrop-blur-2xl p-0 flex flex-col z-100"
        >
            {/* TŁO: Dekoracyjne gradienty wewnątrz menu */}
            <div className="absolute top-0 right-0 -z-10 h-64 w-64 bg-primary/20 blur-[100px] rounded-full opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -z-10 h-40 w-40 bg-blue-500/10 blur-[80px] rounded-full opacity-30 pointer-events-none" />

            {/* 1. HEADER */}
            <SheetHeader className="px-6 py-8 border-b border-white/5 text-left">
                <SheetTitle className="text-2xl font-black tracking-tighter uppercase text-white flex items-center gap-2">
                    <span className="text-primary">M</span> Movie page
                </SheetTitle>
            </SheetHeader>

            {/* 2. NAVIGATION LINKS */}
            <nav className="flex-1 flex flex-col justify-center px-6 gap-6 overflow-y-auto">
                {links.map((link) => (
                    <SheetClose key={link.label} asChild>
                        <Link
                            href={link.href}
                            className={cn(
                                "group flex items-center justify-between text-3xl font-bold uppercase tracking-tight transition-all duration-300",
                                link.active
                                    ? "text-primary pl-4 border-l-4 border-primary"
                                    : "text-white/60 hover:text-white hover:pl-2"
                            )}
                        >
                            <span>{link.label}</span>
                            {/* Strzałka pojawia się tylko przy hoverze */}
                            <HugeiconsIcon
                                icon={ArrowRight01Icon}
                                size={24}
                                className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary"
                            />
                        </Link>
                    </SheetClose>
                ))}
            </nav>

            {/* 3. FOOTER & CTA */}
            <div className="p-6 border-t border-white/5 bg-white/0.02">
                <div className="flex flex-col gap-4">
                    {/* Logowanie / Subskrypcja */}
                    <Button size="lg" className="w-full font-bold uppercase tracking-wide text-base h-12 shadow-lg shadow-primary/20">
                        Sign In / Join
                    </Button>

                    {/* Sociale */}
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            Follow us
                        </p>
                        <div className="flex gap-4">
                            {SOCIAL_ICONS.map((Icon, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-primary transition-colors"
                                >
                                    <HugeiconsIcon icon={Icon} size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="text-[10px] text-white/20 text-center mt-2">
                        © 2026 Movie page. All rights reserved.
                    </div>
                </div>
            </div>
        </SheetContent>
    )
}