"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ShimmerButton } from "@/components/ui/shimmer-button"

interface ButtonProps {
  text: string
  variant?: "primary" | "secondary"
  onClick?: () => void
  className?: string
  isBookingButton?: boolean
}

export default function Button({ text, variant = "primary", onClick, className = "", isBookingButton = false }: ButtonProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSmartBooking = () => {
    if (!mounted) return

    // Smart context-aware booking logic
    if (pathname === '/') {
      // Homepage: Scroll to Hero search widget
      const heroWidget = document.getElementById('hero-search-widget')
      if (heroWidget) {
        heroWidget.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else {
        // Fallback: scroll to the hero section
        const heroSection = document.querySelector('section')
        heroSection?.scrollIntoView({ behavior: 'smooth' })
      }
    } else if (pathname.startsWith('/rooms/') && pathname !== '/rooms') {
      // Individual property page: Scroll to booking widget
      const bookingWidget = document.getElementById('booking-iframe')
      if (bookingWidget) {
        bookingWidget.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    } else {
      // Other pages: Redirect to search
      router.push('/search')
    }
  }

  const handleClick = () => {
    if (isBookingButton && text.toLowerCase().includes('book')) {
      handleSmartBooking()
    } else if (onClick) {
      onClick()
    }
  }

  // Use ShimmerButton for booking buttons, regular button for others
  if (isBookingButton && text.toLowerCase().includes('book')) {
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
