import HospitableBookingWidget from "./HospitableBookingWidget"

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col justify-center overflow-visible">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/1.jpg')`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 flex-1 flex flex-col justify-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in">
          UPGRADE YOUR
          <br />
          NEXT STAY
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light tracking-wide animate-fade-in-delay">
          Experience boutique luxury in the heart of the city
        </p>
      </div>

      {/* Hospitable Booking Widget positioned at bottom */}
      <div id="hero-search-widget" className="relative z-10 pb-8">
        <HospitableBookingWidget />
      </div>
    </section>
  )
}
