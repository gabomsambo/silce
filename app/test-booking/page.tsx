"use client"

import Link from "next/link"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function TestBookingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Hospitable Booking System Test
          </h1>
          
          <div className="space-y-8">
            
            {/* Test Flow Overview */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">Complete Booking Flow</h2>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Homepage search widget → redirects to /search</li>
                <li>Search results page displays available properties</li>
                <li>Click on property → goes to individual property page</li>
                <li>Property page shows booking widget with query parameters</li>
                <li>Complete booking through Hospitable widget</li>
              </ol>
            </div>

            {/* Test Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Homepage Test */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Homepage Search</h3>
                <p className="text-gray-600 mb-4">
                  Test the search widget on the homepage. It should redirect to /search when used.
                </p>
                <Link 
                  href="/"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  Go to Homepage
                </Link>
              </div>

              {/* Search Results Test */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. Search Results</h3>
                <p className="text-gray-600 mb-4">
                  View the search results page with the Hospitable property search widget.
                </p>
                <Link 
                  href="/search"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  View Search Results
                </Link>
              </div>

              {/* All Property Pages */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. One-Bedroom Suite</h3>
                <p className="text-gray-600 mb-4">
                  ID: 1887652 | From $299/night
                </p>
                <Link 
                  href="/rooms/one-bedroom-suite"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  View & Book
                </Link>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">4. Studio Apartment</h3>
                <p className="text-gray-600 mb-4">
                  ID: 1887660 | From $199/night
                </p>
                <Link 
                  href="/rooms/studio-apartment"
                  className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  View & Book
                </Link>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">5. Deluxe Suite</h3>
                <p className="text-gray-600 mb-4">
                  ID: 1887662 | From $399/night
                </p>
                <Link 
                  href="/rooms/deluxe-suite"
                  className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  View & Book
                </Link>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">6. Executive Apartment</h3>
                <p className="text-gray-600 mb-4">
                  ID: 1887648 | From $349/night
                </p>
                <Link 
                  href="/rooms/executive-apartment"
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  View & Book
                </Link>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">7. Premium Studio</h3>
                <p className="text-gray-600 mb-4">
                  ID: 1887654 | From $249/night
                </p>
                <Link 
                  href="/rooms/premium-studio"
                  className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  View & Book
                </Link>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">8. Boutique Loft</h3>
                <p className="text-gray-600 mb-4">
                  ID: 1887656 | From $329/night
                </p>
                <Link 
                  href="/rooms/boutique-loft"
                  className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  View & Book
                </Link>
              </div>
            </div>

            {/* Test with Query Parameters */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-900 mb-3">5. Test Query Parameter Passing</h3>
              <p className="text-yellow-800 mb-4">
                Test the booking widgets with pre-populated search parameters:
              </p>
              <div className="space-y-2">
                <Link 
                  href="/rooms/one-bedroom-suite?checkin=2024-09-01&checkout=2024-09-03&adults=2&children=0"
                  className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded transition-colors mr-4"
                >
                  One-Bedroom with Dates
                </Link>
                <Link 
                  href="/rooms/studio-apartment?checkin=2024-09-15&checkout=2024-09-17&adults=1&children=0"
                  className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  Studio with Dates
                </Link>
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Technical Implementation</h3>
              <div className="space-y-3 text-gray-700">
                <div>
                  <strong>Hospitable Account ID:</strong> fa52067f-9428-4c2a-8830-b54fd59398ad
                </div>
                <div>
                  <strong>All Property IDs:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1 grid grid-cols-1 md:grid-cols-2 gap-1">
                    <li>One-Bedroom Suite: 1887652</li>
                    <li>Studio Apartment: 1887660</li>
                    <li>Deluxe Suite: 1887662</li>
                    <li>Executive Apartment: 1887648</li>
                    <li>Premium Studio: 1887654</li>
                    <li>Boutique Loft: 1887656</li>
                  </ul>
                </div>
                <div>
                  <strong>Widget Base URL:</strong> https://booking.hospitable.com/widget/9f9d3a07-f287-40dc-bb60-1966173ea154/
                </div>
                <div>
                  <strong>Search Widget Script:</strong> https://hospitable.b-cdn.net/direct-property-search-widget/hospitable-search-widget.prod.js
                </div>
                <div>
                  <strong>Total Properties:</strong> 6 unique accommodations with individual booking widgets
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="text-center">
              <Link 
                href="/rooms"
                className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Back to Rooms Overview
              </Link>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
