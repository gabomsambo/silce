import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react"
import Logo from "./Logo"

export default function Footer() {
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
              Redefining hospitality through carefully curated boutique experiences that connect travelers with the
              authentic spirit of each destination.
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
            <h3 className="text-lg font-bold mb-6 tracking-wide">QUICK LINKS</h3>
            <ul className="space-y-3">
              {["Hotels", "Homes", "About", "Reviews", "Shop", "Contact"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-tan transition-colors duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Booking */}
          <div>
            <h3 className="text-lg font-bold mb-6 tracking-wide">BOOKING</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-tan transition-colors duration-300">
                  Make a Reservation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-tan transition-colors duration-300">
                  Group Bookings
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-tan transition-colors duration-300">
                  Special Offers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-tan transition-colors duration-300">
                  Gift Cards
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 tracking-wide">CONTACT</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-tan mr-3 mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>123 Main Street</p>
                  <p>Philadelphia, PA 19103</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-tan mr-3" />
                <a href="tel:+1234567890" className="text-gray-300 hover:text-tan transition-colors duration-300">
                  (123) 456-7890
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-tan mr-3" />
                <a
                  href="mailto:hello@staylokal.com"
                  className="text-gray-300 hover:text-tan transition-colors duration-300"
                >
                  hello@staylokal.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2024 StayLokal. All rights reserved.</p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-tan transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-tan transition-colors duration-300">
                Terms & Conditions
              </a>
              <a href="#" className="text-gray-400 hover:text-tan transition-colors duration-300">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
