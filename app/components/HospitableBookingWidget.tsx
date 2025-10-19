"use client"

import { useEffect, useRef } from "react"
import { useLocale } from "next-intl"

export default function HospitableBookingWidget() {
  const locale = useLocale()
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Insert the Hospitable widget HTML directly
    if (widgetRef.current && typeof window !== 'undefined') {
      widgetRef.current.innerHTML = `<hospitable-direct-mps identifier="fa52067f-9428-4c2a-8830-b54fd59398ad" type="custom" results-url="/${locale}/search"></hospitable-direct-mps>`

      // Log for debugging
      console.log('Hospitable homepage widget inserted, results-url:', `/${locale}/search`)

      // Check if the script has loaded
      const checkWidget = () => {
        if (typeof window !== 'undefined' && (window as any).HospitableWidget) {
          console.log('✅ Hospitable widget script loaded successfully')
        } else {
          console.warn('⚠️ Hospitable widget script not yet loaded')
        }
      }

      // Check immediately and after delays
      checkWidget()
      setTimeout(checkWidget, 1000)
      setTimeout(checkWidget, 3000)
    }
  }, [locale])

  return (
    <div className="relative z-[9999]" style={{ isolation: 'auto' }}>
      {/* Hospitable Widget Container */}
      <div 
        ref={widgetRef} 
        className="hospitable-widget-container" 
        style={{ 
          position: 'relative',
          zIndex: 99999,
          isolation: 'auto'
        }}
      >
        <div className="text-gray-500">Loading booking widget...</div>
      </div>
    </div>
  )
}
