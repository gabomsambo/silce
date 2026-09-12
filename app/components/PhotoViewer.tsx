"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { photoSrcSet } from "@/lib/photos"
import {
  buildPhotoGroups,
  getPhotoGroupBoundary,
  type PhotoGroupKey,
} from "@/lib/photoGroups"
import type { UnitPhoto } from "@/app/data/units"

interface PhotoViewerProps {
  photos: UnitPhoto[]
  unitTitle: string
  open: boolean
  initialIndex: number
  onClose: () => void
}

export default function PhotoViewer({
  photos,
  unitTitle,
  open,
  initialIndex,
  onClose,
}: PhotoViewerProps) {
  const t = useTranslations("unitPage.photoViewer")
  const tGroups = useTranslations("unitPage.photoGroups")
  const [index, setIndex] = useState(initialIndex)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const originalBodyOverflow = useRef<string>("")
  const bookingIframeVisibility = useRef<string | null>(null)

  useEffect(() => {
    if (open) {
      setIndex(Math.max(0, Math.min(initialIndex, photos.length - 1)))
      previouslyFocused.current = document.activeElement as HTMLElement | null
      originalBodyOverflow.current = document.body.style.overflow
      document.body.style.overflow = "hidden"
      const bookingIframe = document.getElementById("booking-iframe")
      if (bookingIframe) {
        bookingIframeVisibility.current = bookingIframe.style.visibility
        bookingIframe.style.visibility = "hidden"
      }
      requestAnimationFrame(() => closeButtonRef.current?.focus())
    } else {
      document.body.style.overflow = originalBodyOverflow.current
      const bookingIframe = document.getElementById("booking-iframe")
      if (bookingIframe && bookingIframeVisibility.current !== null) {
        bookingIframe.style.visibility = bookingIframeVisibility.current
      }
      previouslyFocused.current?.focus?.()
    }
    return () => {
      document.body.style.overflow = originalBodyOverflow.current
      const bookingIframe = document.getElementById("booking-iframe")
      if (bookingIframe && bookingIframeVisibility.current !== null) {
        bookingIframe.style.visibility = bookingIframeVisibility.current
      }
    }
  }, [open, initialIndex, photos.length])

  const groups = useMemo(() => buildPhotoGroups(photos), [photos])
  const current = photos[index]
  const currentGroup = current?.group

  const go = useCallback(
    (next: number) => {
      const wrapped = (next + photos.length) % photos.length
      setIndex(wrapped)
    },
    [photos.length],
  )

  const goToGroup = useCallback(
    (group: PhotoGroupKey) => {
      const match = groups.find((candidate) => candidate.group === group)
      if (match) setIndex(match.indices[0])
    },
    [groups],
  )

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        go(index - 1)
        return
      }
      if (event.key === "ArrowRight") {
        event.preventDefault()
        go(index + 1)
        return
      }
      if (event.key === "PageUp" || event.key === "Home") {
        event.preventDefault()
        setIndex(getPhotoGroupBoundary(groups, index, "first") ?? 0)
        return
      }
      if (event.key === "PageDown" || event.key === "End") {
        event.preventDefault()
        setIndex(getPhotoGroupBoundary(groups, index, "last") ?? photos.length - 1)
        return
      }
      if (event.key === "Tab") {
        const root = dialogRef.current
        if (!root) return
        const focusables = root.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, index, groups, photos.length, go, onClose])

  useEffect(() => {
    if (!open) return
    const activeThumb = dialogRef.current?.querySelector<HTMLElement>(
      '[data-current="true"]',
    )
    activeThumb?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" })
  }, [open, index])

  if (!open || !current) return null

  const groupLabel = currentGroup ? tGroups(currentGroup) : undefined
  const dialogLabel = groupLabel ? `${unitTitle} — ${groupLabel}` : unitTitle

  function GroupButtons({ mobile = false }: { mobile?: boolean }) {
    return groups.map((photoGroup) => {
      const active = photoGroup.group === currentGroup
      return (
        <button
          key={photoGroup.group}
          type="button"
          onClick={() => goToGroup(photoGroup.group)}
          aria-current={active ? "true" : undefined}
          className={`flex shrink-0 items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition ${
            mobile ? "whitespace-nowrap" : "w-full"
          } ${
            active
              ? "bg-white/15 font-semibold text-white"
              : "text-white/80 hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white"
          }`}
        >
          <span>{tGroups(photoGroup.group)}</span>
          <span className="shrink-0 text-xs tabular-nums text-white/70">
            {photoGroup.indices.length}
          </span>
        </button>
      )
    })
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={dialogLabel}
      className="fixed inset-0 z-[2147483647] flex flex-col bg-black/95"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 text-white sm:px-6">
        <div className="min-w-0 text-sm font-semibold">
          <span className="tabular-nums">
            {t("counter", { current: index + 1, total: photos.length })}
          </span>
          {groupLabel ? <span className="ml-2 text-white/75">· {groupLabel}</span> : null}
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={t("closeLabel")}
          className="shrink-0 rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25 focus-visible:bg-white/25"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        {groups.length > 0 ? (
          <aside className="hidden w-56 shrink-0 flex-col gap-1 overflow-y-auto border-r border-white/10 px-3 py-4 text-white md:flex lg:w-64">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-tan">
              {t("groupsHeading")}
            </div>
            <GroupButtons />
            {currentGroup === "neighbourhood" ? (
              <p className="mt-3 border-t border-white/10 px-3 pt-3 text-xs leading-relaxed text-white/70">
                {t("neighbourhoodNote")}
              </p>
            ) : null}
          </aside>
        ) : null}

        <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-12">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label={t("previousLabel")}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white transition hover:bg-white/25 focus-visible:bg-white/25 sm:left-4"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.src}
            srcSet={photoSrcSet(current.src)}
            sizes="(min-width: 1024px) 70vw, 100vw"
            alt={current.sourceCaption ? `${unitTitle} — ${current.sourceCaption}` : unitTitle}
            className="max-h-full max-w-full rounded object-contain"
          />
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label={t("nextLabel")}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white transition hover:bg-white/25 focus-visible:bg-white/25 sm:right-4"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>

      {groups.length > 0 ? (
        <div className="border-t border-white/10 bg-black/80 px-3 pt-2 md:hidden">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-tan">
            {t("groupsHeading")}
          </div>
          <div className="flex gap-1 overflow-x-auto pb-2">
            <GroupButtons mobile />
          </div>
          {currentGroup === "neighbourhood" ? (
            <p className="pb-2 text-xs text-white/70">{t("neighbourhoodNote")}</p>
          ) : null}
        </div>
      ) : null}

      <div className="border-t border-white/10 bg-black/80">
        <div className="flex gap-2 overflow-x-auto px-3 py-3 sm:px-6 sm:py-4">
          {photos.map((photo, photoIndex) => {
            const label = photo.group ? tGroups(photo.group) : undefined
            return (
              <button
                key={photo.src}
                type="button"
                onClick={() => setIndex(photoIndex)}
                data-current={photoIndex === index}
                aria-label={label
                  ? `${label} — ${t("counter", { current: photoIndex + 1, total: photos.length })}`
                  : t("counter", { current: photoIndex + 1, total: photos.length })}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded transition sm:h-20 sm:w-28 ${
                  photoIndex === index
                    ? "outline outline-2 outline-tan outline-offset-1"
                    : "opacity-60 hover:opacity-90 focus-visible:opacity-90"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src.replace(/\.webp$/, "-640.webp")}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

