// @/components/custom-ui/search-overlay.tsx
"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Cancel01Icon, Film01Icon } from "@hugeicons/core-free-icons" // Sprawdź czy masz te ikony
import { getMoviePosterUrl } from "@/lib/movie-utils"
import { Movie } from "@/types/movie"

type SearchOverlayProps = {
    isOpen: boolean
    query: string
    onQueryChange: (val: string) => void
    onClose: () => void
    results: Movie[]
    onSelect: (movie: Movie) => void
}

export const SearchOverlay = ({
    isOpen,
    query,
    onQueryChange,
    onClose,
    results,
    onSelect,
}: SearchOverlayProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen) {
            // Małe opóźnienie dla animacji wejścia
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-100 flex items-start justify-center pt-[15vh] px-4">
            {/* 1. Backdrop z blurem */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-xl transition-all duration-300"
                onClick={onClose}
            />

            {/* 2. Kontener Search */}
            <div className="relative w-full max-w-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">

                {/* Input Field */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center bg-card/50 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
                        <div className="pl-5 text-muted-foreground">
                            <HugeiconsIcon icon={Search01Icon} size={24} />
                        </div>
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={(e) => onQueryChange(e.target.value)}
                            placeholder="Search movies, TV shows..."
                            className="w-full h-16 bg-transparent border-none outline-none text-xl px-4 text-foreground placeholder:text-muted-foreground/50"
                        />
                        <button
                            onClick={onClose}
                            className="pr-5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <span className="text-xs font-medium border border-white/10 rounded px-1.5 py-0.5 mr-2 hidden sm:inline-block">ESC</span>
                            <HugeiconsIcon icon={Cancel01Icon} size={20} className="inline-block" />
                        </button>
                    </div>
                </div>

                {/* Results List */}
                {query.trim() && (
                    <div className="bg-card/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {results.length > 0 ? (
                            <div className="p-2 grid gap-1">
                                {results.map((movie) => (
                                    <button
                                        key={movie.id}
                                        onClick={() => {
                                            onSelect(movie)
                                            onClose()
                                        }}
                                        className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/10 transition-colors group text-left w-full"
                                    >
                                        <div className="relative h-16 w-12 shrink-0 rounded-md overflow-hidden shadow-sm">
                                            <Image
                                                src={getMoviePosterUrl(movie.poster_path, "w500")}
                                                alt={movie.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-base font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                                {movie.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                <HugeiconsIcon icon={Film01Icon} size={12} />
                                                <span>{movie.release_date?.split("-")[0] || "Unknown"}</span>
                                                <span>•</span>
                                                <span className="text-yellow-500/80">★ {movie.vote_average?.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-muted-foreground">
                                <p>No results found for &quot;{query}&quot;</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}