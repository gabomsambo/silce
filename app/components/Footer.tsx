import { getTranslations } from 'next-intl/server';
import { useLocale } from 'next-intl';
import Link from "next/link"
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react"
import Logo from "./Logo"

export default async function Footer() {
  const t = await getTranslations('footer');
  // Get locale for link paths - we'll use a workaround since useLocale is for client components
  // For now, we'll use relative paths that work with middleware

  return (
    <footer className="bg-primary text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Us */}
          <div>
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              {t('tagline')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-tan transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-tan transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-tan transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 tracking-wide">{t('quickLinksHeading')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="./rooms" className="text-gray-300 hover:text-tan transition-colors duration-300">
                  {t('rooms')}
                </Link>
              </li>
              <li>
                <Link href="./about" className="text-gray-300 hover:text-tan transition-colors duration-300">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="./reviews" className="text-gray-300 hover:text-tan transition-colors duration-300">
                  {t('reviews')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Booking */}
          <div>
            <h3 className="text-lg font-bold mb-6 tracking-wide">{t('bookingHeading')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="./rooms" className="text-gray-300 hover:text-tan transition-colors duration-300">
                  {t('browseProperties')}
                </Link>
              </li>
              <li>
                <a href="mailto:silverpineapplehosto@gmail.com?subject=Group Booking Inquiry" className="text-gray-300 hover:text-tan transition-colors duration-300">
                  {t('groupBookings')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 tracking-wide">{t('contactHeading')}</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-tan mr-3 mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <p></p>
                  <p>Melbourne, FL 32935</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-tan mr-3" />
                <a href="tel:+1234567890" className="text-gray-300 hover:text-tan transition-colors duration-300">
                  {/* (123) 456-7890 */}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-tan mr-3" />
                <a
                  href="mailto:silverpineapplehosto@gmail.com"
                  className="text-gray-300 hover:text-tan transition-colors duration-300"
                >
                  silverpineapplehosto@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-400 text-sm">{t('copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
