// @/hooks/use-search.ts
"use client";

import { useState, useEffect, useMemo } from "react";
// Zakładam, że masz te typy, jeśli nie - podmień na swoje
import { type Movie } from "@/types/movie";

export function useSearch(data: Movie[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Skrót klawiszowy CMD+K / CTRL+K do otwierania
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Blokowanie scrollowania strony gdy search jest otwarty
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    return data.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()),
    );
  }, [data, query]);

  const closeSearch = () => {
    setIsOpen(false);
    setQuery("");
  };

  return {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    filteredResults,
    closeSearch,
  };
}
