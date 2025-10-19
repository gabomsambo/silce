"use client"

import { useEffect, useRef } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export default function SearchPage() {
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Function to customize the widget text after it loads
    const customizeWidgetText = () => {
      const checkAndCustomize = () => {
        // Look for text nodes and elements that might contain property count
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null
        )

        const textNodesToUpdate = []
        let node

        while (node = walker.nextNode()) {
          const text = node.textContent
          if (text && (
            // Match patterns like "8 of 8 properties", "5 of 8 properties available", etc.
            /\d+\s+of\s+\d+\s+propert/i.test(text) ||
            // Match "Showing 8 properties" or similar
            /showing\s+\d+\s+propert/i.test(text) ||
            // Match "8 properties found" or similar
            /\d+\s+propert.*found/i.test(text)
          )) {
            textNodesToUpdate.push(node)
          }
        }

        // Update the text nodes
        textNodesToUpdate.forEach(node => {
          const originalText = node.textContent
          if (!originalText) return

          let newText = originalText

          // Replace various patterns with "Properties available"
          newText = newText.replace(/\d+\s+of\s+\d+\s+properties?(\s+available)?/gi, 'Properties available')
          newText = newText.replace(/showing\s+\d+\s+properties?/gi, 'Properties available')
          newText = newText.replace(/\d+\s+properties?\s+found/gi, 'Properties available')
          newText = newText.replace(/\d+\s+properties?\s+match/gi, 'Properties available')

          if (newText !== originalText) {
            node.textContent = newText
          }
        })

        // Also check for elements with specific text content
        const elements = document.querySelectorAll('span, div, p, h1, h2, h3, h4, h5, h6')
        elements.forEach(element => {
          if (element.children.length === 0 && element.textContent) {
            const text = element.textContent.trim()
            if (/\d+\s+of\s+\d+\s+propert/i.test(text) ||
                /showing\s+\d+\s+propert/i.test(text) ||
                /\d+\s+propert.*found/i.test(text)) {
              element.textContent = 'Properties available'
            }
          }
        })
      }

      // Run immediately and then periodically to catch dynamic updates
      checkAndCustomize()
      const interval = setInterval(checkAndCustomize, 500)

      // Clean up after 60 seconds
      setTimeout(() => clearInterval(interval), 60000)
    }

    // Start customization after a short delay to let the widget load
    const timer = setTimeout(customizeWidgetText, 2000)

    // Also set up a MutationObserver to catch dynamic content changes
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          shouldCheck = true
        }
      })

      if (shouldCheck) {
        // Debounce the check to avoid excessive calls
        clearTimeout((window as any).hospTextCheckTimeout)
        ;(window as any).hospTextCheckTimeout = setTimeout(() => {
          const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null
          )

          let node
          while (node = walker.nextNode()) {
            const text = node.textContent
            if (text && /\d+\s+of\s+\d+\s+propert/i.test(text)) {
              node.textContent = text.replace(/\d+\s+of\s+\d+\s+properties?(\s+available)?/gi, 'Properties available')
            }
          }
        }, 100)
      }
    })

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    })

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      clearTimeout((window as any).hospTextCheckTimeout)
    }
  }, [])

  return (
    <main className="min-h-screen bg-coastal-mist">
      <Navbar />

      {/* Custom CSS to hide property counts */}
      <style jsx>{`
        /* Hide elements that show property counts */
        :global([class*="property-count"]),
        :global([class*="results-count"]),
        :global([class*="total-properties"]) {
          display: none !important;
        }

        /* Target common patterns for property count text */
        :global(*:contains("of")) {
          /* This will be handled by JavaScript */
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Search Results
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your perfect boutique accommodation from our curated selection
          </p>
        </div>
      </section>

      {/* Search Results Widget */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div
            ref={widgetRef}
            className="hospitable-search-results-container min-h-[600px]"
            dangerouslySetInnerHTML={{
              __html: '<hospitable-direct-mps identifier="fa52067f-9428-4c2a-8830-b54fd59398ad" type="custom"></hospitable-direct-mps>'
            }}
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}
