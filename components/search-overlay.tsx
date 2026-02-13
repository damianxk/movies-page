// @/components/custom-ui/search-overlay.tsx
"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Cancel01Icon, Film01Icon, Tv01Icon, UserIcon } from "@hugeicons/core-free-icons"
import { getMoviePosterUrl } from "@/lib/movie-utils"
import { Button } from "@/components/ui/button"
import { type SearchResultItem, type SearchType } from "@/hooks/use-search"

type SearchOverlayProps = {
    isOpen: boolean
    query: string
    onQueryChange: (val: string) => void
    onClose: () => void
    activeType: SearchType
    onTypeChange: (type: SearchType) => void
    results: SearchResultItem[]
    isLoading: boolean
    error: string | null
    onSelect: (item: SearchResultItem) => void
}

export const SearchOverlay = ({
    isOpen,
    query,
    onQueryChange,
    onClose,
    activeType,
    onTypeChange,
    results,
    isLoading,
    error,
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
                            placeholder="Search movies, TV shows or people..."
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

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        size="sm"
                        variant={activeType === "movie" ? "default" : "secondary"}
                        onClick={() => onTypeChange("movie")}
                    >
                        Movies
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={activeType === "tv" ? "default" : "secondary"}
                        onClick={() => onTypeChange("tv")}
                    >
                        TV
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={activeType === "person" ? "default" : "secondary"}
                        onClick={() => onTypeChange("person")}
                    >
                        People
                    </Button>
                </div>

                {/* Results List */}
                {query.trim().length >= 2 && (
                    <div className="bg-card/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="p-12 text-center text-muted-foreground">
                                <p>Searching...</p>
                            </div>
                        ) : error ? (
                            <div className="p-12 text-center text-destructive">
                                <p>{error}</p>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="p-2 grid gap-1">
                                {results.map((item) => (
                                    <button
                                        key={`${item.mediaType}-${item.id}`}
                                        onClick={() => {
                                            onSelect(item)
                                            onClose()
                                        }}
                                        className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/10 transition-colors group text-left w-full"
                                    >
                                        <div className="relative h-16 w-12 shrink-0 rounded-md overflow-hidden shadow-sm">
                                            <Image
                                                src={getMoviePosterUrl(item.imagePath, "w500")}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-base font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                                {item.title}
                                            </h4>
                                            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                                                <HugeiconsIcon
                                                    icon={
                                                        item.mediaType === "movie"
                                                            ? Film01Icon
                                                            : item.mediaType === "tv"
                                                              ? Tv01Icon
                                                              : UserIcon
                                                    }
                                                    size={12}
                                                />
                                                <span>{item.subtitle}</span>
                                                {item.year ? (
                                                    <>
                                                        <span>•</span>
                                                        <span>{item.year}</span>
                                                    </>
                                                ) : null}
                                                {item.voteAverage ? (
                                                    <>
                                                        <span>•</span>
                                                        <span className="text-yellow-500/80">
                                                            ★ {item.voteAverage.toFixed(1)}
                                                        </span>
                                                    </>
                                                ) : null}
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

                {query.trim().length > 0 && query.trim().length < 2 ? (
                    <p className="px-1 text-sm text-muted-foreground">Type at least 2 characters.</p>
                ) : null}
            </div>
        </div>
    )
}