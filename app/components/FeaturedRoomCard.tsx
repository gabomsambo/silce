"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BorderBeam } from "@/components/ui/border-beam"
import { ShimmerButton } from "@/components/ui/shimmer-button"

interface FeaturedRoomCardProps {
  room: {
    id: number
    name: string
    description: string
    image: string
    location: string
    price?: string
    slug?: string
  }
}

export default function FeaturedRoomCard({ room }: FeaturedRoomCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-white/95
  backdrop-blur-sm shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Border Beam Effect */}
      <BorderBeam 
        size={200} 
        duration={8} 
        colorFrom="#D4AF37" 
        colorTo="#B8860B"
        className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* Image Container */}
      <div className="relative h-80 overflow-hidden">
        <Image
          src={room.image}
          alt={room.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Location Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
          {room.location}
        </div>
        
        {/* Check Availability Button - Overlay on Image */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          {room.slug ? (
            <Link href={`/rooms/${room.slug}`}>
              <ShimmerButton
                className="bg-tan hover:bg-tan/90 text-white font-semibold px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm border-tan/20"
                background="rgba(212, 175, 55, 1)"
                shimmerColor="#ffffff"
                shimmerDuration="2s"
                borderRadius="0.75rem"
              >
                Check Availability
              </ShimmerButton>
            </Link>
          ) : (
            <ShimmerButton
              className="bg-tan hover:bg-tan/90 text-white font-semibold px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm border-tan/20"
              background="rgba(212, 175, 55, 1)"
              shimmerColor="#ffffff"
              shimmerDuration="2s"
              borderRadius="0.75rem"
            >
              Check Availability
            </ShimmerButton>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-bold text-primary group-hover:text-tan transition-colors duration-300">
            {room.name}
          </h3>
          {room.price && (
            <div className="text-right">
              <p className="text-lg font-semibold text-tan">{room.price}</p>
            </div>
          )}
        </div>
        <p className="text-gray-600 leading-relaxed">
          {room.description}
        </p>
        
        {/* Bottom CTA for non-hover state */}
        {room.slug && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link 
              href={`/rooms/${room.slug}`}
              className="inline-flex items-center text-tan hover:text-tan/80 font-medium transition-colors duration-200"
            >
              View Details & Book →
            </Link>
          </div>
        )}
      </div>
      
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-tan/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  )
}
