"use client"

import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { ShimmerButton } from "@/components/ui/shimmer-button"

export default function HospitableConfigPage() {
  const [currentDomain, setCurrentDomain] = useState("")
  
  // Your property data with Hospitable IDs
  const properties = [
    {
      id: "1887652", //Unit 2526
      name: "The One-Bedroom Suite: Unit 2526",
      slug: "one-bedroom-suite",
      currentUrl: "/rooms/one-bedroom-suite"
    },
    {
      id: "1887660", //Unit 2528
      name: "The Studio Apartment: Unit 2528",
      slug: "studio-apartment",
      currentUrl: "/rooms/studio-apartment"
    },
    {
      id: "1887662", //Sea Grape 102 Nice apt on the beach
      name: "The Deluxe Suite: Sea Grape 102", 
      slug: "deluxe-suite",
      currentUrl: "/rooms/deluxe-suite"
    },
    {
      id: "1887648", //Pineapple unit 102
      name: "The Executive Apartment: Pineapple unit 102",
      slug: "executive-apartment", 
      currentUrl: "/rooms/executive-apartment"
    },
    {
      id: "1887654", //Unit 2536
      name: "The Premium Studio: Unit 2536",
      slug: "premium-studio",
      currentUrl: "/rooms/premium-studio"
    },
    {
      id: "1887656", //Unit 2538
      name: "The Boutique Loft: Unit 2538",
      slug: "boutique-loft",
      currentUrl: "/rooms/boutique-loft"
    }
  ]

  const handleGetDomain = () => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin
      setCurrentDomain(origin)
      
      // Check if it's localhost and show additional guidance
      if (origin.includes('localhost')) {
        console.log('🚨 Local development detected! See ngrok instructions below.')
      }
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔧 Hospitable Configuration Guide
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fix the 404 errors by updating your property URLs in the Hospitable dashboard
            </p>
          </div>

          {/* Problem Explanation */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-red-900 mb-3">🚨 The Problem</h2>
            <p className="text-red-800 mb-4">
              When users click on search results, they get 404 errors because the property URLs 
              configured in your Hospitable dashboard don't match your actual property page URLs.
            </p>
            <p className="text-red-800">
              <strong>Solution:</strong> Update each property's "Property URL" in Hospitable to match the URLs below.
            </p>
          </div>

          {/* Get Domain */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-3">🌐 Step 1: Get Your Domain</h2>
            <div className="flex items-center gap-4 mb-4">
              <ShimmerButton
                onClick={handleGetDomain}
                className="bg-blue-600 text-white px-4 py-2"
                background="rgba(37, 99, 235, 1)"
              >
                Get Current Domain
              </ShimmerButton>
              {currentDomain && (
                <div className="bg-white border border-blue-300 rounded px-3 py-2">
                  <code className="text-blue-800 font-mono">{currentDomain}</code>
                </div>
              )}
            </div>
            
            {/* Local Development Warning */}
            {currentDomain && currentDomain.includes('localhost') && (
              <div className="bg-orange-100 border border-orange-300 rounded-lg p-4">
                <h3 className="font-bold text-orange-900 mb-2">⚠️ Local Development Detected</h3>
                <p className="text-orange-800 text-sm mb-3">
                  <code>localhost</code> URLs won't work with Hospitable redirects. Choose an option below:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Option 1 (Recommended):</strong> Use ngrok for testing (see instructions below)</p>
                  <p><strong>Option 2:</strong> Deploy to Vercel/Netlify first, then configure</p>
                  <p><strong>Option 3:</strong> Use localhost for limited testing (same-machine only)</p>
                </div>
              </div>
            )}
          </div>

          {/* Ngrok Instructions for Local Development */}
          {currentDomain && currentDomain.includes('localhost') && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-purple-900 mb-4">🚀 Recommended: Use Ngrok for Local Testing</h2>
              
              <div className="space-y-4">
                <div className="bg-white border border-purple-300 rounded p-4">
                  <h3 className="font-bold text-purple-900 mb-2">Step 1: Install Ngrok</h3>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">npm install -g ngrok</code>
                  <p className="text-sm text-purple-700 mt-2">Or download from <a href="https://ngrok.com" className="underline">ngrok.com</a></p>
                </div>

                <div className="bg-white border border-purple-300 rounded p-4">
                  <h3 className="font-bold text-purple-900 mb-2">Step 2: Create Public Tunnel</h3>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">ngrok http 3001</code>
                  <p className="text-sm text-purple-700 mt-2">This creates a public URL like <code>https://abc123.ngrok.io</code></p>
                </div>

                <div className="bg-white border border-purple-300 rounded p-4">
                  <h3 className="font-bold text-purple-900 mb-2">Step 3: Use Ngrok URL</h3>
                  <p className="text-sm text-purple-700">
                    Replace <code>localhost:3001</code> with your ngrok URL in the property configurations below.
                    <br />
                    Example: <code>https://abc123.ngrok.io/rooms/one-bedroom-suite</code>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Property URLs Configuration */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-green-900 mb-4">
              ✅ Step 2: Configure These URLs in Hospitable Dashboard
            </h2>
            <p className="text-green-800 mb-6">
              For each property below, copy the "Full URL" and paste it into the "Property URL" field 
              in your Hospitable dashboard.
            </p>

            <div className="space-y-4">
              {properties.map((property) => (
                <div key={property.id} className="bg-white border border-green-300 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{property.name}</h3>
                      <p className="text-sm text-gray-600">Hospitable ID: {property.id}</p>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => copyToClipboard(`${currentDomain}${property.currentUrl}`)}
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        Copy URL
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded p-3">
                    <p className="text-xs text-gray-600 mb-1">Full URL to configure in Hospitable:</p>
                    <code className="text-sm font-mono text-gray-800 break-all">
                      {currentDomain || "[YOUR-DOMAIN]"}{property.currentUrl}
                    </code>
                  </div>

                  {/* Test Link */}
                  <div className="mt-2">
                    <a 
                      href={property.currentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      🔗 Test this property page →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-yellow-900 mb-4">📋 Step 3: Update Hospitable Dashboard</h2>
            <ol className="list-decimal list-inside space-y-2 text-yellow-800">
              <li>Log into your Hospitable dashboard</li>
              <li>Go to Properties → Select a property</li>
              <li>Find the "Property URL" or "Website URL" field</li>
              <li>Paste the corresponding full URL from above</li>
              <li>Save the changes</li>
              <li>Repeat for all 6 properties</li>
            </ol>
          </div>

          {/* Quick Deploy Option */}
          {currentDomain && currentDomain.includes('localhost') && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-green-900 mb-4">⚡ Alternative: Quick Deploy for Testing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-green-300 rounded p-4">
                  <h3 className="font-bold text-green-900 mb-2">Vercel (Recommended)</h3>
                  <div className="space-y-2 text-sm text-green-800">
                    <p>1. <code>npm install -g vercel</code></p>
                    <p>2. <code>vercel</code> (in project directory)</p>
                    <p>3. Follow prompts → Get live URL</p>
                    <p>4. Use live URL for Hospitable config</p>
                  </div>
                </div>

                <div className="bg-white border border-green-300 rounded p-4">
                  <h3 className="font-bold text-green-900 mb-2">Netlify</h3>
                  <div className="space-y-2 text-sm text-green-800">
                    <p>1. <code>npm run build</code></p>
                    <p>2. Drag <code>out/</code> folder to netlify.com</p>
                    <p>3. Get live URL instantly</p>
                    <p>4. Use live URL for Hospitable config</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Testing */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-purple-900 mb-4">🧪 Step 4: Test the Flow</h2>
            <div className="space-y-3 text-purple-800">
              <p>1. <a href="/search" className="text-purple-600 underline">Go to search page</a></p>
              <p>2. Enter some dates and search</p>
              <p>3. Click on a property result</p>
              <p>4. You should now be redirected to the correct property page!</p>
            </div>
          </div>

          {/* Debug Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">🔍 Debug Information</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Current Page:</strong> /hospitable-config</p>
              <p><strong>Property Pages:</strong> /rooms/[slug]</p>
              <p><strong>Search Page:</strong> /search</p>
              <p><strong>Total Properties:</strong> {properties.length}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
