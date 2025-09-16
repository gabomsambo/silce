import type { LucideIcon } from "lucide-react"

interface Philosophy {
  icon: LucideIcon
  title: string
  description: string
}

interface PhilosophyGridProps {
  philosophies: Philosophy[]
}

export default function PhilosophyGrid({ philosophies }: PhilosophyGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {philosophies.map((philosophy, index) => (
        <div key={index} className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300">
          <div className="w-20 h-20 bg-tan/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-tan/20 transition-colors duration-300">
            <philosophy.icon className="w-10 h-10 text-tan" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-4">{philosophy.title}</h3>
          <p className="text-gray-600 leading-relaxed">{philosophy.description}</p>
        </div>
      ))}
    </div>
  )
}
