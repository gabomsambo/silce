import FeaturedRoomCard from "./FeaturedRoomCard"

export default function FeaturedRooms() {
  // Featured selection of our actual properties
  const rooms = [
    {
      id: 1,
      name: "The One-Bedroom Suite: Unit 2526",
      description: "Spacious and elegantly appointed, our one-bedroom suites offer the perfect blend of comfort and sophistication with separate living areas and full kitchen.",
      image: "/1.jpg",
      location: "Premium Location",
      price: "From $299/night",
      slug: "one-bedroom-suite",
    },
    {
      id: 2,
      name: "The Deluxe Suite: Sea Grape 102",
      description: "Experience ultimate luxury in our flagship deluxe suite, featuring premium amenities, stunning views, and sophisticated design throughout.",
      image: "/2.jpg",
      location: "Luxury Collection",
      price: "From $399/night",
      slug: "deluxe-suite",
    },
    {
      id: 3,
      name: "The Studio Apartment: Unit 2528",
      description: "Thoughtfully designed for the modern traveler, our studio apartments maximize space without compromising on style or comfort.",
      image: "/3.jpg",
      location: "Modern Design",
      price: "From $199/night",
      slug: "studio-apartment",
    },
  ]

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-muted/50 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6 tracking-tight">
            FEATURED LOCATIONS
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our handpicked selection of premium accommodations, each offering a unique blend of luxury, comfort, and unforgettable experiences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {rooms.map((room, index) => (
            <div key={room.id} className={`${index === 2 ? 'lg:col-span-2 max-w-2xl mx-auto' : ''}`}>
              <FeaturedRoomCard room={room} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
