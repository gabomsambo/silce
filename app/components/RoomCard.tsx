"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Users, Bed, ChefHat, Wifi, Tv, Car, Coffee } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"

interface Amenity {
  icon: string
  text: string
}

interface RoomCardProps {
  title: string
  description: string
  images?: string[] // Make optional
  amenities?: Amenity[] // Make optional
  imagePosition: "left" | "right"
  price: string
  slug?: string // Add slug for linking to individual pages
}

const iconMap = {
  users: Users,
  bed: Bed,
  "chef-hat": ChefHat,
  wifi: Wifi,
  tv: Tv,
  car: Car,
  coffee: Coffee,
}

export default function RoomCard({
  title,
  description,
  images = [], // Add default empty array
  amenities = [], // Add default empty array
  imagePosition,
  price,
  slug,
}: RoomCardProps) {
  const t = useTranslations("rooms.card")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Add safety check for images
  const safeImages = images.length > 0 ? images : ["/PHOTO-2025-06-19-12-33-37.jpg"]

  const nextImage = () => {
    if (safeImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % safeImages.length)
    }
  }

  const prevImage = () => {
    if (safeImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length)
    }
  }

  const goToImage = (index: number) => {
    if (index >= 0 && index < safeImages.length) {
      setCurrentImageIndex(index)
    }
  }

  const ImageCarousel = () => (
    <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden group">
      <div className="relative w-full h-full">
        <Image
          src={safeImages[currentImageIndex] || "/placeholder.svg"}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          fill
          className="object-cover transition-transform duration-500"
        />

        {/* Navigation Arrows - Only show if more than 1 image */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </>
        )}

        {/* Gradient Overlay for Dots */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent h-20" />
        )}
      </div>

      {/* Pagination Dots - Only show if more than 1 image */}
      {safeImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {safeImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? "bg-white scale-110" : "bg-white/60 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )

  const TextContent = () => (
    <div className="flex flex-col justify-center h-full">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight">{title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">{description}</p>
          <div className="text-2xl font-semibold text-tan mb-8">{price}</div>
        </div>

        {/* Amenities Grid */}
        {amenities.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {amenities.map((amenity, index) => {
              const IconComponent = iconMap[amenity.icon as keyof typeof iconMap]
              if (!IconComponent) return null // Skip if icon not found

              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-tan/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-tan" />
                  </div>
                  <span className="text-gray-700 font-medium">{amenity.text}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA Button */}
        {slug ? (
          <Link
            href={`/rooms/${slug}`}
            className="inline-block w-full md:w-auto bg-tan hover:bg-tan/90 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center"
          >
            {t("buttonPrimary")}
          </Link>
        ) : (
          <button className="w-full md:w-auto bg-tan hover:bg-tan/90 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            {t("buttonFallback")}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
            imagePosition === "right" ? "lg:grid-flow-col-dense" : ""
          }`}
        >
          {/* Image Column */}
          <div className={`${imagePosition === "right" ? "lg:col-start-2" : ""}`}>
            <ImageCarousel />
          </div>

          {/* Text Column */}
          <div className={`${imagePosition === "right" ? "lg:col-start-1" : ""}`}>
            <TextContent />
          </div>
        </div>
      </div>
    </section>
  )
}
