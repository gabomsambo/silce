import Image from "next/image"
import { Instagram } from "lucide-react"

export default function InstagramFeed() {
  const images = [
    "/1.jpg",
    "/2.jpg",
    "/3.jpg",
    "/4.jpg",
    "/5.jpg",
    "/6.jpg",
    "/7.jpg",
    "/PHOTO-2025-06-19-12-33-37 (1).jpg",
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">FOLLOW OUR JOURNEY</h2>
          <p className="text-lg text-gray-600 mb-8">Get inspired by our latest moments and guest experiences</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg">
              <Image
                src={image || "/placeholder.svg"}
                alt={`Instagram post ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="#"
            className="inline-flex items-center text-tan font-semibold hover:text-tan/80 transition-colors duration-300"
          >
            <Instagram className="w-5 h-5 mr-2" />
            FOLLOW @STAYLOKAL
          </a>
        </div>
      </div>
    </section>
  )
}
