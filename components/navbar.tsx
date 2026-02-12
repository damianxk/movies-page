// @/components/custom-ui/navbar.tsx
"use client"

import { useSearch } from "@/hooks/use-search"
import { SearchOverlay } from "./search-overlay"
import { Movie } from "@/types/movie"
import { NAV_LINKS } from "@/components/navigation/nav-config"
import { NavLogo } from "@/components/navigation/nav-logo"
import { DesktopNav } from "@/components/navigation/desktop-nav"
import { NavbarActions } from "@/components/navigation/navbar-actions"

type NavbarProps = {
    searchData: Movie[] // Przekazujemy dane do wyszukiwarki
    onSelectMovie?: (movie: Movie) => void
}

export const Navbar = ({ searchData, onSelectMovie }: NavbarProps) => {
    const { isOpen, setIsOpen, query, setQuery, filteredResults, closeSearch } =
        useSearch(searchData)

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-b from-background/90 via-background/60 to-transparent pointer-events-none h-24 md:h-32" />

                <div className="relative px-4 md:px-8 h-20 flex items-center justify-between">
                    <NavLogo />
                    <DesktopNav links={NAV_LINKS} />
                    <NavbarActions links={NAV_LINKS} onOpenSearch={() => setIsOpen(true)} />
                </div>
            </header>

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