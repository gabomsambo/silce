"use client"

import { useState, useRef } from "react"
import { Mail, Heart, Star, Coffee, Gift, MapPin, Check } from "lucide-react"

import { Confetti, type ConfettiRef } from "@/components/ui/confetti"


export default function BoutiqueNewsletterSignup() {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    interests: [] as string[],
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const confettiRef = useRef<ConfettiRef>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((item) => item !== value)
        : [...prev.interests, value],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    
    // Trigger confetti celebration
    confettiRef.current?.fire({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    console.log("Boutique newsletter signup:", formData)
  }

  // Boutique family business benefits
  const benefits = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Personal Recommendations",
      description: "Handpicked suggestions from our family to yours"
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Family Discounts",
      description: "Exclusive offers for our close-knit community"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Local Insider Tips",
      description: "Hidden gems and local favorites we love to share"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Warm Hospitality",
      description: "Personal touches that make you feel at home"
    }
  ]

  // Simple interest options
  const interests = [
    { id: "new-studios", label: "New Studio Openings" },
    { id: "local-tips", label: "Local Experiences" },
    { id: "special-offers", label: "Family Discounts" },
    { id: "seasonal", label: "Seasonal Recommendations" }
  ]



  if (isSubmitted) {
    return (
      <section className="py-24 bg-gradient-to-br from-coastal-sunrise/10 to-coastal-teal/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/6.jpg')] bg-cover bg-center opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <MagicCard className="p-12 bg-white/90 backdrop-blur-md">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-primary mb-4">Welcome to Our Family!</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Thank you for joining our close-knit community. We're excited to share our personal 
                recommendations and help make your stays truly special.
              </p>
              <div className="mt-8 p-4 bg-tan/10 rounded-lg">
                <p className="text-sm text-gray-700">
                  Keep an eye on your inbox for a warm welcome message from our family, 
                  including your exclusive discount code!
                </p>
              </div>
            </MagicCard>
          </div>
        </div>
        <Confetti ref={confettiRef} className="fixed inset-0 pointer-events-none z-50" />
      </section>
    )
  }

  return (
    <section className="py-24 bg-gradient-to-br from-coastal-sunrise/10 to-coastal-teal/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/6.jpg')] bg-cover bg-center opacity-5" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Header with Personal Touch */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Join Our Family
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Be part of our close-knit community and receive personal recommendations, 
              family discounts, and insider tips from our hearts to yours.
            </p>
          </div>



          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Benefits Section */}
            <div>
              <h3 className="text-2xl font-bold text-primary mb-8">What Makes Us Special</h3>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/50 transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-tan/10 rounded-lg flex items-center justify-center text-tan">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">{benefit.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signup Form */}
            <div>
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-200 p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-tan/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-tan" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-2">Stay Connected</h3>
                    <p className="text-gray-600">Join our family for personal touches and exclusive offers</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6 bg-white text-gray-900">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("firstName")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 bg-white text-gray-900 ${
                          focusedField === "firstName" 
                            ? "border-tan ring-2 ring-tan/20 shadow-lg" 
                            : "border-gray-300 hover:border-tan/50"
                        }`}
                        placeholder="Your first name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 bg-white text-gray-900 ${
                          focusedField === "email" 
                            ? "border-tan ring-2 ring-tan/20 shadow-lg" 
                            : "border-gray-300 hover:border-tan/50"
                        }`}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        What interests you most?
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {interests.map((interest) => (
                          <label key={interest.id} className="flex items-center space-x-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={formData.interests.includes(interest.id)}
                              onChange={() => handleCheckboxChange(interest.id)}
                              className="w-4 h-4 text-tan border-gray-300 rounded focus:ring-tan/20"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                              {interest.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-tan hover:bg-tan/90 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Join Our Family
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Confetti ref={confettiRef} className="fixed inset-0 pointer-events-none z-50" />
    </section>
  )
}
