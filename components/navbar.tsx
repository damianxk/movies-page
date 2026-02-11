// @/components/custom-ui/navbar.tsx
"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Menu01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSearch } from "@/hooks/use-search"
import { SearchOverlay } from "./search-overlay"
import { Movie } from "@/types/movie"
import { cn } from "@/lib/utils"
import { MobileMenu } from "./mobile-menu"

// Przykładowe linki - w prawdziwej apce mogą być z configa
const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Movies", href: "/movies" },
    { label: "Series", href: "/series" },
    { label: "New & Popular", href: "/new" },
]

type NavbarProps = {
    searchData: Movie[] // Przekazujemy dane do wyszukiwarki
    onSelectMovie?: (movie: Movie) => void
}

export const Navbar = ({ searchData, onSelectMovie }: NavbarProps) => {
    const {
        isOpen,
        setIsOpen,
        query,
        setQuery,
        filteredResults,
        closeSearch
    } = useSearch(searchData)

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
                {/* Gradient tła - zanika w dół, dając czytelność na obrazkach */}
                <div className="absolute inset-0 bg-linear-to-b from-background/90 via-background/60 to-transparent pointer-events-none h-24 md:h-32" />

                <div className="relative px-4 md:px-8 h-20 flex items-center justify-between">

                    {/* 1. LOGO */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            M
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground/90 group-hover:text-foreground transition-colors uppercase">
                            Moviestan
                        </span>
                    </Link>

                    {/* 2. DESKTOP NAV */}
                    <nav className="hidden md:flex items-center gap-8 bg-black/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/5 shadow-lg">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground hover:text-white transition-colors relative"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* 3. ACTIONS */}
                    <div className="flex items-center gap-3">
                        {/* Search Trigger */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(true)}
                            className="rounded-full hover:bg-white/10 text-muted-foreground hover:text-white"
                        >
                            <HugeiconsIcon icon={Search01Icon} size={20} />
                        </Button>

                        {/* Mobile Menu Trigger */}
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

                            {/* UŻYCIE NOWEGO KOMPONENTU */}
                            <MobileMenu links={NAV_LINKS as any[]} />
                        </Sheet>
                    </div>
                </div>
            </header>

            {/* SEARCH OVERLAY - Renderowany poza headerem */}
            <SearchOverlay
                isOpen={isOpen}
                query={query}
                onQueryChange={setQuery}
                onClose={closeSearch}
                results={filteredResults}
                onSelect={(m) => onSelectMovie?.(m)}
            />
        </>
    )
}