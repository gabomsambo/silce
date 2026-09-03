"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "@/i18n/navigation"
import { ShimmerButton } from "@/components/ui/shimmer-button"

export type BookingAction = "scroll-to-widget" | "go-to-rooms" | "already-there"

export function bookingActionForPath(pathname: string): BookingAction {
  if (pathname.startsWith('/rooms/')) return "scroll-to-widget"
  if (pathname === '/rooms') return "already-there"
  return "go-to-rooms"
}

interface ButtonProps {
  text: string
  variant?: "primary" | "secondary"
  onClick?: () => void
  className?: string
  isBookingButton?: boolean
  bookingAction?: BookingAction
}

export default function Button({ text, variant = "primary", onClick, className = "", isBookingButton = false, bookingAction }: ButtonProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSmartBooking = () => {
    if (!mounted) return

    const action = bookingAction ?? bookingActionForPath(pathname)

    // Already on the inventory: neither navigating nor scrolling helps the guest
    if (action === "already-there") return

    if (action === "scroll-to-widget") {
      // Individual property page: Scroll to booking widget
      const bookingWidget = document.getElementById('booking-iframe')
      if (bookingWidget) {
        bookingWidget.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
    }

    // Any page without a booking widget: send the guest to the inventory
    router.push('/rooms')
  }

  const handleClick = () => {
    onClick?.()

    if (isBookingButton) {
      handleSmartBooking()
    }
  }

  // Use ShimmerButton for booking buttons, regular button for others
  if (isBookingButton) {
    return (
      <ShimmerButton
        onClick={handleClick}
        className={`px-6 py-3 text-sm font-bold tracking-wide uppercase ${className}`}
        background="rgba(212, 175, 55, 1)"
        shimmerColor="#ffffff"
        shimmerDuration="3s"
        borderRadius="0.375rem"
      >
        {text}
      </ShimmerButton>
    )
  }

  const baseClasses =
    "px-6 py-3 text-sm font-bold tracking-wide uppercase transition-all duration-300 transform hover:scale-105"

  const variants = {
    primary: "bg-tan text-white hover:bg-tan/90 shadow-lg hover:shadow-xl",
    secondary: "bg-transparent border-2 border-tan text-tan hover:bg-tan hover:text-white",
  }

  return (
    <button onClick={handleClick} className={`${baseClasses} ${variants[variant]} ${className}`}>
      {text}
    </button>
  )
}
