"use client"

import { useState, useEffect } from "react"
import { Menu, X, Languages } from "lucide-react"
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import Link from "next/link"
import Logo from "./Logo"
import Button from "./Button"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const t = useTranslations('navbar')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: t('home'), href: `/${locale}` },
    { name: t('rooms'), href: `/${locale}/rooms` },
    { name: t('about'), href: `/${locale}/about` },
    { name: t('reviews'), href: `/${locale}/reviews` },
  ]

  const switchLanguage = () => {
    const newLocale = locale === 'en' ? 'es' : 'en'
    // Remove current locale from pathname and add new locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '')
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gradient-to-r from-white via-coastal-mist/5 to-white shadow-lg"
          : "bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={`/${locale}`}>
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium tracking-wide transition-colors duration-200 text-gray-900 hover:text-tan"
              >
                {link.name.toUpperCase()}
              </Link>
            ))}
            <Button text={t('bookNow')} variant="primary" isBookingButton={true} />
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-900 hover:text-tan transition-colors duration-200 border border-gray-300 rounded-md hover:border-tan"
              onClick={switchLanguage}
            >
              <Languages size={18} />
              <span>{t('languageToggle')}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-900">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 text-sm font-medium text-gray-900 hover:text-tan"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name.toUpperCase()}
                </Link>
              ))}
              <div className="px-3 py-2">
                <Button text={t('bookNow')} variant="primary" isBookingButton={true} />
              </div>
              <div className="px-3 py-2">
                <button
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-900 hover:text-tan transition-colors duration-200 border border-gray-300 rounded-md hover:border-tan"
                  onClick={() => {
                    switchLanguage()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <Languages size={18} />
                  <span>{t('translateTo')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
