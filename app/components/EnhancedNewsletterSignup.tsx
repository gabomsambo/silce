"use client"

import { useState, useRef } from "react"
import { Mail, MapPin, Users, Calendar, Gift, Check, Star, TrendingUp, Heart, Coffee } from "lucide-react"
import { MagicCard } from "@/components/ui/magic-card"
import NumberTicker from "@/components/ui/number-ticker"
import { ShineBorder } from "@/components/ui/shine-border"
import { Confetti, type ConfettiRef } from "@/components/ui/confetti"
import Button from "./Button"

export default function EnhancedNewsletterSignup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    travelStyle: [] as string[],
    propertyTypes: [] as string[],
    budgetRange: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const confettiRef = useRef<ConfettiRef>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (category: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [category]: prev[category as keyof typeof prev].includes(value)
        ? (prev[category as keyof typeof prev] as string[]).filter((item) => item !== value)
        : [...(prev[category as keyof typeof prev] as string[]), value],
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
    
    setTimeout(() => {
      confettiRef.current?.fire({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      })
    }, 250)
    
    setTimeout(() => {
      confettiRef.current?.fire({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      })
    }, 400)

    console.log("Enhanced newsletter signup:", formData)
  }

  const benefits = [
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Exclusive Discounts",
      description: "Save 15% on your first booking + member-only deals"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Early Access",
      description: "Be first to book new properties and seasonal availability"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Local Insider Tips",
      description: "Curated recommendations from our local hosts"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "VIP Treatment",
      description: "Priority support and special welcome amenities"
    }
  ]

  const travelStyles = [
    { id: "business", label: "Business Travel", icon: <Coffee className="w-4 h-4" /> },
    { id: "leisure", label: "Leisure & Vacation", icon: <Heart className="w-4 h-4" /> },
    { id: "romantic", label: "Romantic Getaways", icon: <Heart className="w-4 h-4" /> },
    { id: "family", label: "Family Trips", icon: <Users className="w-4 h-4" /> }
  ]

  const propertyTypes = [
    { id: "apartments", label: "Modern Apartments" },
    { id: "houses", label: "Entire Houses" },
    { id: "penthouses", label: "Luxury Penthouses" },
    { id: "unique", label: "Unique Stays" }
  ]

  if (isSubmitted) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-tan/10 via-white to-primary/5 relative overflow-hidden">
        <Confetti
          ref={confettiRef}
          className="absolute inset-0 pointer-events-none"
          manualstart={true}
        />
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Welcome to Silver Pineapple VIP! 🎉</h2>
            <p className="text-xl text-gray-600 mb-6">
              Thank you, {formData.firstName}! You're now part of our exclusive community of discerning travelers.
            </p>
            <div className="bg-tan/10 border border-tan/20 rounded-xl p-6 max-w-md mx-auto">
              <h3 className="font-semibold text-primary mb-2">Your Welcome Gift</h3>
              <p className="text-gray-700">Check your email for a <strong>15% discount code</strong> valid for your next booking!</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-tan/10 via-white to-primary/5 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-tan/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6 tracking-tight">
            STAY IN THE KNOW
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join our exclusive community of discerning travelers and unlock insider access to premium accommodations, 
            local experiences, and unbeatable deals.
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-tan mb-2">
                <NumberTicker value={12500} />+
              </div>
              <p className="text-gray-600 font-medium">Happy Travelers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-tan mb-2 flex items-center justify-center">
                <NumberTicker value={4.9} decimalPlaces={1} />
                <Star className="w-8 h-8 ml-2 fill-tan text-tan" />
              </div>
              <p className="text-gray-600 font-medium">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-tan mb-2">
                <NumberTicker value={150} />+
              </div>
              <p className="text-gray-600 font-medium">Premium Properties</p>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <MagicCard
              key={index}
              className="p-6 text-center hover:shadow-xl transition-all duration-300"
              gradientColor="#D4AF37"
              gradientOpacity={0.1}
            >
              <div className="text-tan mb-4 flex justify-center">{benefit.icon}</div>
              <h3 className="font-bold text-primary mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </MagicCard>
          ))}
        </div>

        {/* Enhanced Form */}
        <div className="max-w-4xl mx-auto">
          <MagicCard
            className="p-8 md:p-12"
            gradientColor="#D4AF37"
            gradientOpacity={0.15}
          >
            <div className="relative">
              <ShineBorder
                className="rounded-2xl"
                shineColor={["#D4AF37", "#F4E4BC", "#D4AF37"]}
                duration={8}
                borderWidth={2}
              />
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-6 flex items-center">
                    <Users className="w-6 h-6 mr-3 text-tan" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("firstName")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-tan focus:border-tan outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        required
                      />
                      {focusedField === "firstName" && (
                        <ShineBorder
                          className="rounded-xl"
                          shineColor="#D4AF37"
                          duration={3}
                          borderWidth={2}
                        />
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("lastName")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-tan focus:border-tan outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        required
                      />
                      {focusedField === "lastName" && (
                        <ShineBorder
                          className="rounded-xl"
                          shineColor="#D4AF37"
                          duration={3}
                          borderWidth={2}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact & Location */}
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-6 flex items-center">
                    <Mail className="w-6 h-6 mr-3 text-tan" />
                    Contact & Location
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-tan focus:border-tan outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        required
                      />
                      {focusedField === "email" && (
                        <ShineBorder
                          className="rounded-xl"
                          shineColor="#D4AF37"
                          duration={3}
                          borderWidth={2}
                        />
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="location"
                        placeholder="Your City (for local recommendations)"
                        value={formData.location}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("location")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-tan focus:border-tan outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      />
                      {focusedField === "location" && (
                        <ShineBorder
                          className="rounded-xl"
                          shineColor="#D4AF37"
                          duration={3}
                          borderWidth={2}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Travel Preferences */}
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-6 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3 text-tan" />
                    Travel Preferences
                  </h3>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-4 font-medium">What type of traveler are you? (Select all that apply)</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {travelStyles.map((style) => (
                        <label
                          key={style.id}
                          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                            formData.travelStyle.includes(style.id)
                              ? "border-tan bg-tan/10 text-tan"
                              : "border-gray-200 hover:border-tan/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.travelStyle.includes(style.id)}
                            onChange={() => handleCheckboxChange("travelStyle", style.id)}
                            className="sr-only"
                          />
                          <div className="flex items-center space-x-2">
                            {style.icon}
                            <span className="text-sm font-medium">{style.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-4 font-medium">Preferred property types:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {propertyTypes.map((type) => (
                        <label
                          key={type.id}
                          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                            formData.propertyTypes.includes(type.id)
                              ? "border-tan bg-tan/10 text-tan"
                              : "border-gray-200 hover:border-tan/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.propertyTypes.includes(type.id)}
                            onChange={() => handleCheckboxChange("propertyTypes", type.id)}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-4 font-medium">Budget range per night:</p>
                    <div className="relative">
                      <select
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("budget")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-tan focus:border-tan outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      >
                        <option value="">Select your budget range</option>
                        <option value="under-200">Under $200</option>
                        <option value="200-400">$200 - $400</option>
                        <option value="400-600">$400 - $600</option>
                        <option value="600-1000">$600 - $1,000</option>
                        <option value="over-1000">Over $1,000</option>
                      </select>
                      {focusedField === "budget" && (
                        <ShineBorder
                          className="rounded-xl"
                          shineColor="#D4AF37"
                          duration={3}
                          borderWidth={2}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <Button 
                    text="JOIN THE VIP COMMUNITY" 
                    variant="primary"
                    className="px-12 py-4 text-lg font-bold transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                  />
                  <p className="text-sm text-gray-500 mt-4">
                    By subscribing, you agree to receive exclusive offers and updates. Unsubscribe anytime.
                  </p>
                </div>
              </form>
            </div>
          </MagicCard>
        </div>

        {/* Social Proof */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Trusted by travelers worldwide</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-sm font-medium">Featured in Travel + Leisure</div>
            <div className="text-sm font-medium">Airbnb Superhost Partner</div>
            <div className="text-sm font-medium">VRBO Premier Host</div>
          </div>
        </div>
      </div>
    </section>
  )
}
