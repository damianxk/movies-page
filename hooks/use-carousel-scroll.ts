// @/hooks/use-carousel-auto-scroll.ts
"use client";

import { useEffect, useRef } from "react";
import { type CarouselApi } from "@/components/ui/carousel";

/**
 * Automatycznie przewija karuzelę do wybranego indeksu,
 * ale TYLKO jeśli element nie jest w pełni widoczny.
 */
export function useCarouselAutoScroll(
  api: CarouselApi | undefined,
  selectedIndex: number,
) {
  const lastHandledIndex = useRef<number | null>(null);

  useEffect(() => {
    if (!api) return;
    if (selectedIndex < 0) return;

    // 1. Zapobiegamy skokowi przy pierwszym renderze (opcjonalne, zależnie od preferencji UX)
    // Jeśli chcesz, aby przy wejściu na stronę od razu scrollowało do aktywnego: usuń ten blok.
    if (lastHandledIndex.current === null) {
      lastHandledIndex.current = selectedIndex;
      return;
    }

    // 2. Jeśli indeks się nie zmienił, nie robimy nic
    if (lastHandledIndex.current === selectedIndex) return;

    const viewportNode = api.rootNode();
    const slideNodes = api.slideNodes();
    const slideNode = slideNodes[selectedIndex];

    if (!viewportNode || !slideNode) return;

    // 3. Obliczamy pozycję
    const viewportRect = viewportNode.getBoundingClientRect();
    const slideRect = slideNode.getBoundingClientRect();

    // Tolerancja 2px na błędy zaokrągleń przeglądarki
    const edgeTolerance = 2;

    const isFullyVisible =
      slideRect.left >= viewportRect.left - edgeTolerance &&
      slideRect.right <= viewportRect.right + edgeTolerance;

    // 4. Scrollujemy tylko jeśli element wystaje poza widok
    if (!isFullyVisible) {
      api.scrollTo(selectedIndex);
    }

    lastHandledIndex.current = selectedIndex;
  }, [api, selectedIndex]);
}
