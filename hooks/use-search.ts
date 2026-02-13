"use client"

import { useEffect, useState } from "react"

export type SearchType = "movie" | "tv" | "person"

export type SearchResultItem = {
  id: number
  mediaType: SearchType
  title: string
  subtitle: string
  imagePath: string | null
  year: string | null
  voteAverage: number | null
}

export function useSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeType, setActiveType] = useState<SearchType>("movie")
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
  }, [isOpen])

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setResults([])
      setError(null)
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          type: activeType,
          query: trimmed,
          page: "1",
        })

        const response = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error("Search request failed.")
        }

        const data: { results: SearchResultItem[] } = await response.json()
        setResults(data.results ?? [])
      } catch (searchError) {
        if ((searchError as Error).name === "AbortError") return
        setError("Unable to load search results.")
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [query, activeType])

  const closeSearch = () => {
    setIsOpen(false)
    setQuery("")
    setResults([])
    setError(null)
  }

  return {
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
  }
}
