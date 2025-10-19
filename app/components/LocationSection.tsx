"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

export default function LocationSection() {
  const t = useTranslations("about.location")

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-coastal-dune/15">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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
            </div>

            {/* Neighborhood Highlights */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <h4 className="font-semibold text-primary mb-2">{t("arts.title")}</h4>
                <p className="text-sm text-gray-600">
                  {t("arts.description")}
                </p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <h4 className="font-semibold text-primary mb-2">{t("dining.title")}</h4>
                <p className="text-sm text-gray-600">
                  {t("dining.description")}
                </p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <h4 className="font-semibold text-primary mb-2">{t("parks.title")}</h4>
                <p className="text-sm text-gray-600">
                  {t("parks.description")}
                </p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <h4 className="font-semibold text-primary mb-2">{t("beach.title")}</h4>
                <p className="text-sm text-gray-600">
                  {t("beach.description")}
                </p>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden">
            <Image
              src="/beach+artsdistrict.jpeg"
              alt="Eau Gallie neighborhood and riverfront"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}