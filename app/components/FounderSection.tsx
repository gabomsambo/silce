import { Users } from "lucide-react"
import Image from "next/image"

export default function FounderSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-coastal-mist/30 to-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 tracking-tight">
          How We Operate
        </h2>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="flex flex-col items-center">
            {/* Photo - same size as icon was */}
            <div className="w-24 h-24 rounded-full overflow-hidden mb-6 ring-2 ring-tan/20">
              <Image 
                src="/logo_house.jpeg"
                alt="Team"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
              Silver Pineapple is locally managed by a small, hands-on team. We value clear communication, quick
              responses, and the kind of thoughtful touches that make short stays feel effortless. While we keep a low
              profile, we’re always nearby when you need us a friendly, reliable, and committed to a great experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}