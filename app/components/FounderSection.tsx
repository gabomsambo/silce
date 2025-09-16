import { Users } from "lucide-react"

export default function FounderSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 tracking-tight">
          Meet the Team
        </h2>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
          <div className="flex flex-col items-center">
            {/* Icon (no personal photo) */}
            <div className="w-24 h-24 rounded-full bg-tan/10 flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-tan" />
            </div>

            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
              Silver Pineapple is locally managed by a small, hands-on team. We value clear communication, quick
              responses, and the kind of thoughtful touches that make short stays feel effortless. While we keep a low
              profile, we’re always nearby when you need us — friendly, reliable, and committed to a great experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}