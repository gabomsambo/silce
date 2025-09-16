"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import Image from "next/image"

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "StayLokal exceeded all expectations. The attention to detail and personalized service made our Philadelphia getaway absolutely unforgettable.",
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "The Cape May property was stunning. Waking up to ocean views and experiencing such thoughtful hospitality was the perfect escape we needed.",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "From booking to checkout, everything was seamless. The historic district loft was beautifully appointed and the location couldn't have been better.",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">GUEST EXPERIENCES</h2>
          <p className="text-lg text-gray-600">What our guests are saying about their StayLokal experience</p>
        </div>

        <div className="relative">
          <div className="bg-muted rounded-lg p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-tan fill-current" />
              ))}
            </div>

            <blockquote className="text-xl md:text-2xl text-primary mb-8 leading-relaxed italic">
              "{testimonials[currentSlide].text}"
            </blockquote>

            <div className="flex items-center justify-center">
              <Image
                src={testimonials[currentSlide].avatar || "/placeholder.svg"}
                alt={testimonials[currentSlide].name}
                width={60}
                height={60}
                className="rounded-full mr-4"
              />
              <div>
                <div className="font-semibold text-primary">{testimonials[currentSlide].name}</div>
                <div className="text-gray-600 text-sm">Verified Guest</div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-tan" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
