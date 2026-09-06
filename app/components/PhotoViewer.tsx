"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { photoSrcSet } from "@/lib/photos"
import type { PhotoRoomKey, UnitPhoto } from "@/app/data/units"

/**
 * Fullscreen photo viewer for the unit page.
 *
 * - A flat filmstrip across the bottom shows every photo in order; clicking
 *   a thumbnail jumps to it. The thumbnail of the currently-shown photo is
 *   highlighted.
 * - A vertical room rail on the left groups photos by `room` and lists each
 *   room in the order `studio → kitchen → bath → grounds → area`, plus a
 *   final "Photos" group for any photo whose room label is `unit` (the
 *   honest "we don't know which room this is" fallback). Clicking a room
 *   jumps to its first photo.
 * - Keyboard: Esc closes; ArrowLeft / ArrowRight step. PageUp / PageDown
 *   jump to the first / last photo of the current room.
 * - Focus is trapped while the viewer is open: Tab cycles the controls
 *   inside the panel, and the dialog itself is rendered with `role="dialog"`
 *   and `aria-modal="true"`.
 * - `body { overflow: hidden }` is toggled while open so the page underneath
 *   does not scroll; the original overflow value is restored on close.
 * - The viewer is `position: fixed; inset: 0; z-index: 2147483647`. The
 *   booking iframe uses the same defensive z-index, so it is temporarily
 *   hidden while the viewer is open to keep the modal visually complete.
 */

interface PhotoViewerProps {
  photos: UnitPhoto[]
  unitTitle: string
  open: boolean
  initialIndex: number
  onClose: () => void
}

// The canonical room order. "area" deliberately comes after "grounds" so
// the river sunset and the Eau Gallie arch are read as "the neighbourhood"
// rather than another room of the unit. "unit" is the catch-all bucket
// for photos whose room has not been labelled yet — the viewer collapses
// it into one group labelled "Photos" so a half-labelled unit still works.
const ROOM_ORDER: PhotoRoomKey[] = ["studio", "kitchen", "bath", "grounds", "area", "unit"]

export default function PhotoViewer({
  photos,
  unitTitle,
  open,
  initialIndex,
  onClose,
}: PhotoViewerProps) {
  const t = useTranslations("unitPage.photoViewer")
  const tRooms = useTranslations("unitPage.photoRooms")
  const [index, setIndex] = useState(initialIndex)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const originalBodyOverflow = useRef<string>("")
  const bookingIframeVisibility = useRef<string | null>(null)

  // When the viewer opens, snap to the requested photo and remember what
  // had focus so we can restore it on close.
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
      // Move focus to the close button on the next tick so the screen
      // reader announces the dialog after it has been rendered.
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
      // Restore on unmount even if the viewer was force-closed by a parent
      // re-render without first toggling `open` to false.
      document.body.style.overflow = originalBodyOverflow.current
      const bookingIframe = document.getElementById("booking-iframe")
      if (bookingIframe && bookingIframeVisibility.current !== null) {
        bookingIframe.style.visibility = bookingIframeVisibility.current
      }
    }
  }, [open, initialIndex, photos.length])

  // Group photos by room in the canonical order. We do this once per
  // photos array (useMemo), not per render, because `photos` is stable
  // across re-renders of the same unit page.
  const groups = useMemo(() => {
    const map = new Map<PhotoRoomKey, number[]>()
    ROOM_ORDER.forEach((room) => {
      const indices = photos.flatMap((photo, photoIndex) =>
        photo.room === room ? [photoIndex] : [],
      )
      if (indices.length > 0) {
        map.set(room, indices)
      }
    })
    return ROOM_ORDER.filter((r) => map.has(r)).map((room) => ({
      room,
      indices: map.get(room) as number[],
    }))
  }, [photos])

  const current = photos[index]
  const currentRoom = current?.room

  const go = useCallback(
    (next: number) => {
      const wrapped = (next + photos.length) % photos.length
      setIndex(wrapped)
    },
    [photos.length],
  )

  const goToRoom = useCallback(
    (room: PhotoRoomKey) => {
      const g = groups.find((x) => x.room === room)
      if (g) setIndex(g.indices[0])
    },
    [groups],
  )

  // Keyboard handling. Bound at the dialog level so it stays active even
  // when the focus is on a non-interactive child.
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
        const g = groups.find((x) => x.room === currentRoom)
        if (g) setIndex(g.indices[0])
        return
      }
      if (event.key === "PageDown" || event.key === "End") {
        event.preventDefault()
        const g = groups.find((x) => x.room === currentRoom)
        if (g) setIndex(g.indices[g.indices.length - 1])
        return
      }
      if (event.key === "Tab") {
        // Trap focus inside the dialog.
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
  }, [open, index, currentRoom, groups, go, onClose])

  // Auto-scroll the active thumbnail into view so the filmstrip follows
  // the user as they arrow through photos.
  useEffect(() => {
    if (!open) return
    const activeThumb = dialogRef.current?.querySelector<HTMLElement>(
      '[data-current="true"]',
    )
    activeThumb?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" })
  }, [open, index])

  if (!open || !current) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${unitTitle} — ${tRooms(current.room)}`}
      className="fixed inset-0 z-[2147483647] flex flex-col bg-black/95"
    >
      {/* Top bar — close + counter */}
      <div className="flex items-center justify-between px-4 py-3 text-white sm:px-6">
        <div className="text-sm font-semibold tabular-nums">
          {t("counter", { current: index + 1, total: photos.length })}
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={t("closeLabel")}
          className="rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25 focus-visible:bg-white/25"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Room rail (desktop only) */}
        <aside className="hidden md:flex w-56 lg:w-64 shrink-0 flex-col gap-1 overflow-y-auto border-r border-white/10 px-3 py-4 text-white">
          <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-tan">
            {t("roomsHeading")}
          </div>
          {groups.map((g) => {
            const active = g.room === currentRoom
            return (
              <button
                key={g.room}
                type="button"
                onClick={() => goToRoom(g.room)}
                aria-current={active ? "true" : undefined}
                className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm transition ${
                  active
                    ? "bg-white/15 font-semibold"
                    : "hover:bg-white/10 focus-visible:bg-white/10"
                }`}
              >
                <span className="truncate">{tRooms(g.room)}</span>
                <span className="shrink-0 text-xs text-white/55 tabular-nums">{g.indices.length}</span>
              </button>
            )
          })}
          {currentRoom === "area" ? (
            <p className="mt-3 border-t border-white/10 px-2 pt-3 text-[11px] leading-relaxed text-white/55">
              {t("areaNote", { room: tRooms("area") })}
            </p>
          ) : null}
        </aside>

        {/* Photo + arrows */}
        <div className="relative flex flex-1 items-center justify-center px-4 pb-32 sm:px-12">
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
            alt={`${unitTitle} — ${tRooms(current.room)}`}
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

      {/* Filmstrip */}
      <div className="border-t border-white/10 bg-black/80">
        <div className="flex gap-2 overflow-x-auto px-3 py-3 sm:px-6 sm:py-4">
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setIndex(i)}
              data-current={i === index}
              aria-label={tRooms(p.room)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded transition sm:h-20 sm:w-28 ${
                i === index
                  ? "outline outline-2 outline-tan outline-offset-1"
                  : "opacity-60 hover:opacity-90 focus-visible:opacity-90"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src.replace(/\.webp$/, "-640.webp")}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
