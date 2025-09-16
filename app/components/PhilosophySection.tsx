import { Heart, Zap, MapPin, Shield } from "lucide-react"

export default function PhilosophySection() {
  const philosophies = [
    {
      icon: Heart,
      title: "Comfort & Convenience",
      description:
        "Renovated, practical spaces with on-site laundry and easy parking — the essentials handled so you can relax.",
    },
    {
      icon: Zap,
      title: "Seamless Stays",
      description:
        "Simple bookings, clear communication, and flexible short-term or seasonal options for stress-free travel.",
    },
    {
      icon: MapPin,
      title: "Local Connection",
      description:
        "Live steps from the Eau Gallie Public Library, murals, galleries, coffee, and riverfront parks in Melbourne’s arts district.",
    },
    {
      icon: Shield,
      title: "Trusted Hospitality",
      description:
        "Friendly, responsive, locally based management focused on cleanliness, comfort, and a worry-free stay.",
    },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">What We Value</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Four simple pillars that guide every stay at Silver Pineapple.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {philosophies.map((philosophy, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-20 h-20 bg-tan/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-tan/20 transition-colors duration-300">
                <philosophy.icon className="w-10 h-10 text-tan" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">{philosophy.title}</h3>
              <p className="text-gray-600 leading-relaxed">{philosophy.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}