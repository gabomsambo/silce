"use client"

import { useEffect, useState } from "react"
import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/navigation"
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import { BUSINESS_CONTACT } from "@/app/data/contact"
import Logo from "./Logo"
import ContactForm from "./ContactForm"
import { clearCookieConsent } from "./cookieConsent"

// Every route here is prerendered, so the year baked into the HTML is the build
// year. Rendering that on the hydrating pass keeps server and client identical;
// the effect below then advances it for anyone viewing after a New Year.
const BUILD_YEAR = Number(process.env.NEXT_PUBLIC_BUILD_YEAR) || new Date().getFullYear()

export default function Footer() {
  const t = useTranslations('footer');
  const [year, setYear] = useState(BUILD_YEAR)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-primary text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2 lg:grid-cols-12">
          {/* About Us */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <Logo tone="light" />
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              {t('tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-6 tracking-wide">{t('quickLinksHeading')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/rooms" className="text-gray-300 hover:text-tan transition-colors duration-300">
                  {t('rooms')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-tan transition-colors duration-300">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-gray-300 hover:text-tan transition-colors duration-300">
                  {t('reviews')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Booking */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-6 tracking-wide">{t('bookingHeading')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/rooms" className="text-gray-300 hover:text-tan transition-colors duration-300">
                  {t('browseProperties')}
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${BUSINESS_CONTACT.email}?subject=Group Booking Inquiry`}
                  aria-label={t('groupBookingsLabel')}
                  className="text-gray-300 hover:text-tan transition-colors duration-300"
                >
                  {t('groupBookings')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="min-w-0 md:col-span-2 lg:col-span-5">
            <h3 className="text-lg font-bold mb-6 tracking-wide">{t('contactHeading')}</h3>
            <p className="mb-5 text-gray-300">{t('contactIntro')}</p>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin aria-hidden="true" className="w-5 h-5 text-tan mr-3 mt-1 flex-shrink-0" />
                <p className="text-gray-300">
                  <span className="sr-only">{t('addressLabel')}</span>
                  {BUSINESS_CONTACT.location}
                </p>
              </div>
              <div className="flex items-center">
                <Mail aria-hidden="true" className="w-5 h-5 text-tan mr-3" />
                <a
                  href={`mailto:${BUSINESS_CONTACT.email}`}
                  aria-label={t('emailLabel')}
                  className="break-all text-base font-semibold text-white underline decoration-tan decoration-2 underline-offset-4 transition-colors duration-300 hover:text-tan"
                >
                  {BUSINESS_CONTACT.email}
                </a>
              </div>
              {BUSINESS_CONTACT.phoneAndWhatsApp && (
                <>
                  <div className="flex items-center">
                    <Phone aria-hidden="true" className="w-5 h-5 text-tan mr-3" />
                    <a
                      href={`tel:${BUSINESS_CONTACT.phoneAndWhatsApp}`}
                      className="text-gray-300 hover:text-tan transition-colors duration-300"
                    >
                      {BUSINESS_CONTACT.phoneAndWhatsApp}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle aria-hidden="true" className="w-5 h-5 text-tan mr-3" />
                    <a
                      href={`https://wa.me/${BUSINESS_CONTACT.phoneAndWhatsApp.replace(/\D/g, "")}`}
                      className="text-gray-300 hover:text-tan transition-colors duration-300"
                    >
                      {t('whatsApp')}
                    </a>
                  </div>
                </>
              )}
            </div>
            <ContactForm />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6">
            <p className="text-gray-400 text-sm">{t('copyright', { year })}</p>
            <button
              type="button"
              onClick={() => clearCookieConsent()}
              className="text-gray-400 text-sm underline underline-offset-4 hover:text-tan transition-colors duration-300"
            >
              {t('cookiePreferences')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
