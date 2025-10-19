import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
// import HospitableBookingWidget from "./HospitableBookingWidget"

export default async function Hero() {
  const t = await getTranslations('hero');

  return (
    <section className="relative h-screen flex flex-col justify-center overflow-visible">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/silver_pineapple_home_update.jpeg')`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 flex-1 flex flex-col justify-center -mt-32">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in">
          {t('heading')}
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light tracking-wide animate-fade-in-delay">
          {t('subheading')}
        </p>
      </div>

      {/* Hospitable Booking Widget positioned at bottom - TEMPORARILY DISABLED */}
      {/* <div id="hero-search-widget" className="relative z-10 pb-8">
        <HospitableBookingWidget />
      </div> */}

      {/* Temporary Book Now button - links to rooms page */}
      <div className="relative z-10 pb-12 flex justify-center">
        <Link 
          href="/rooms"
          className="px-8 py-4 bg-white text-[#1a1a1a] font-semibold text-lg rounded-lg hover:bg-tan hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {t('bookNow', { default: 'Book Now' })}
        </Link>
      </div>
    </section>
  )
}
