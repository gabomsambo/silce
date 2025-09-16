import { Wifi, Key, Clock, Car, Coffee, Tv2, Wind, WashingMachine } from "lucide-react"

export default function AmenityGrid() {
  const amenities = [
    { icon: Wifi,  title: "High-Speed Wi-Fi",   description: "Reliable internet in every unit" },
    { icon: Key,   title: "Keyless Entry",      description: "Secure digital access" },
    { icon: Clock, title: "Self Check-In",      description: "Flexible arrivals" },
    { icon: Car,   title: "Parking",            description: "Convenient on-site options" },
    { icon: WashingMachine, title: "On-Site Laundry", description: "Easy, practical stays" },
    { icon: Coffee, title: "Coffee & Tea",      description: "Complimentary in every unit" },
    { icon: Tv2,   title: "Smart TV",           description: "Log into your streaming apps" },
    { icon: Wind,  title: "A/C & Heating",      description: "Comfort year-round" },
  ]

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">Included Amenities</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practical comforts across all Silver Pineapple stays
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {amenities.map((A, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-tan/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <A.icon className="w-8 h-8 text-tan" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">{A.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{A.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}