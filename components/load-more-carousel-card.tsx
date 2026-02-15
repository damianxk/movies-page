"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

type LoadMoreCarouselCardProps = {
  href: string
  canLoadMore: boolean
  idleLabel: string
  loadingLabel: string
  doneLabel: string
}

export function LoadMoreCarouselCard({
  href,
  canLoadMore,
  idleLabel,
  loadingLabel,
  doneLabel,
}: LoadMoreCarouselCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const disabled = !canLoadMore || isPending
  const label = canLoadMore ? (isPending ? loadingLabel : idleLabel) : doneLabel

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (!canLoadMore) return
        startTransition(() => {
          router.push(href, { scroll: false })
        })
      }}
      className="group flex h-full w-full flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-black/25 p-3 text-center transition-colors enabled:hover:border-primary/70 enabled:hover:bg-black/35 disabled:cursor-not-allowed disabled:opacity-70"
      aria-busy={isPending}
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
        {label}
      </span>
      <span className="mt-1 text-[11px] text-slate-400">
        {canLoadMore ? "Fetch the next page" : "You reached the end"}
      </span>
    </button>
  )
}
