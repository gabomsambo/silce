import Image from "next/image"

export default function IntroductionSection() {
  return (
    <section className="py-20 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Column */}
          <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden">
            <Image
              src="/collage-about.png"
              alt="Silver Pineapple courtyard and buildings"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Text Column */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 tracking-tight">
              Two Buildings. One Backyard. All Welcome.
            </h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Silver Pineapple is a pair of friendly, locally managed buildings that share a sunny backyard — a
                simple, comfortable home base for short stays, work trips, and seasonal escapes in the heart of Eau Gallie.
              </p>
              <p>
                We keep things easy: renovated units, on-site laundry, and hassle-free parking. Step outside and you’re
                beside the Eau Gallie Public Library and a walkable arts district full of color, coffee, galleries, and river breezes.
              </p>
              <p>
                Our goal is neighborly hospitality — clear communication, practical comforts, and a real connection to
                the neighborhood so you can live like a local from day one.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}