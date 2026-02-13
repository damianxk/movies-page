// @/components/custom-ui/navbar.tsx
"use client"

import { useRouter } from "next/navigation"
import { useSearch } from "@/hooks/use-search"
import { SearchOverlay } from "./search-overlay"
import { NAV_LINKS } from "@/components/navigation/nav-config"
import { NavLogo } from "@/components/navigation/nav-logo"
import { DesktopNav } from "@/components/navigation/desktop-nav"
import { NavbarActions } from "@/components/navigation/navbar-actions"

export const Navbar = () => {
    const router = useRouter()
    const {
        isOpen,
        setIsOpen,
        query,
        setQuery,
        activeType,
        setActiveType,
        results,
        isLoading,
        error,
        closeSearch,
    } = useSearch()

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
                activeType={activeType}
                onTypeChange={setActiveType}
                results={results}
                isLoading={isLoading}
                error={error}
                onSelect={(item) => {
                    if (item.mediaType === "movie") {
                        router.push(`/movies/${item.id}`)
                        return
                    }

                    const externalUrl =
                        item.mediaType === "tv"
                            ? `https://www.themoviedb.org/tv/${item.id}`
                            : `https://www.themoviedb.org/person/${item.id}`
                    window.open(externalUrl, "_blank", "noopener,noreferrer")
                }}
            />
        </>
    )
}