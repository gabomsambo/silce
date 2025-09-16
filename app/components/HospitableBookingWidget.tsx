"use client"

import { useEffect, useRef } from "react"

export default function HospitableBookingWidget() {
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create the custom element after component mounts
    if (widgetRef.current && typeof window !== 'undefined') {
      const hospElement = document.createElement('hospitable-direct-mps')
      hospElement.setAttribute('identifier', 'fa52067f-9428-4c2a-8830-b54fd59398ad')
      hospElement.setAttribute('type', 'custom')
      hospElement.setAttribute('results-url', '/search')
      
      // Clear any existing content and append the widget
      widgetRef.current.innerHTML = ''
      widgetRef.current.appendChild(hospElement)
      
      // Log for debugging
      console.log('Hospitable widget element created and added to DOM')
    }
    
    // Check if the script has loaded
    const checkWidget = () => {
      if (typeof window !== 'undefined' && (window as any).HospitableWidget) {
        console.log('Hospitable widget script loaded successfully')
      }
    }
    
    // Check immediately and after a delay
    checkWidget()
    const timer = setTimeout(checkWidget, 2000)
    
    return () => clearTimeout(timer)
  }, [])

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
