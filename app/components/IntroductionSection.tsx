"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

export default function IntroductionSection() {
  const t = useTranslations("about.introduction")

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
              {t("heading")}
            </h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                {t("paragraph1")}
              </p>
              <p>
                {t("paragraph2")}
              </p>
              <p>
                {t("paragraph3")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}