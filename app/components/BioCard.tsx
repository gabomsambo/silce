import Image from "next/image"

interface BioCardProps {
  name: string
  title: string
  image: string
  bio: string[]
  quote: string
}

export default function BioCard({ name, title, image, bio, quote }: BioCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
      <div className="flex flex-col items-center">
        {/* Profile Image */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 mb-8">
          <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover rounded-full" />
        </div>

        {/* Name and Title */}
        <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">{name}</h3>
        <p className="text-lg text-tan font-medium mb-6">{title}</p>

        {/* Bio */}
        <div className="max-w-3xl space-y-4 text-lg text-gray-700 leading-relaxed mb-8">
          {bio.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-xl md:text-2xl text-primary font-light italic text-center border-l-4 border-tan pl-6">
          "{quote}"
        </blockquote>
      </div>
    </div>
  )
}
