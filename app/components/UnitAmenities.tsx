"use client"

import { useLocale, useTranslations } from "next-intl"

const AMENITY_LABELS: Record<string, { en: string; es: string }> = {
  ac: { en: "Air conditioning", es: "Aire acondicionado" },
  baking_sheet: { en: "Baking sheet", es: "Bandeja para hornear" },
  bathtub: { en: "Bathtub", es: "Bañera" },
  bed_linens: { en: "Bed linens", es: "Ropa de cama" },
  blender: { en: "Blender", es: "Licuadora" },
  body_soap: { en: "Body soap", es: "Jabón corporal" },
  books: { en: "Books", es: "Libros" },
  carbon_monoxide_detector: { en: "Carbon monoxide detector", es: "Detector de monóxido de carbono" },
  ceiling_fan: { en: "Ceiling fan", es: "Ventilador de techo" },
  cleaning_before_checkout: { en: "Checkout cleaning instructions", es: "Instrucciones de limpieza al salir" },
  clothes_drying_rack: { en: "Clothes drying rack", es: "Tendedero" },
  coffee: { en: "Coffee", es: "Café" },
  coffee_maker: { en: "Coffee maker", es: "Cafetera" },
  conditioner: { en: "Conditioner", es: "Acondicionador" },
  cooking_basics: { en: "Cooking basics", es: "Básicos de cocina" },
  dining_table: { en: "Dining table", es: "Mesa de comedor" },
  dishes_and_silverware: { en: "Dishes and silverware", es: "Vajilla y cubiertos" },
  dryer: { en: "Dryer", es: "Secadora" },
  essentials: { en: "Essentials", es: "Artículos esenciales" },
  ethernet_connection: { en: "Ethernet connection", es: "Conexión Ethernet" },
  extra_pillows_and_blankets: { en: "Extra pillows and blankets", es: "Almohadas y mantas extra" },
  fire_extinguisher: { en: "Fire extinguisher", es: "Extintor" },
  free_on_premise_parking: { en: "Free on-site parking", es: "Estacionamiento gratis en el lugar" },
  freezer: { en: "Freezer", es: "Congelador" },
  garden: { en: "Garden", es: "Jardín" },
  hair_dryer: { en: "Hair dryer", es: "Secador de pelo" },
  hangers: { en: "Hangers", es: "Ganchos para ropa" },
  heating: { en: "Heating", es: "Calefacción" },
  hot_water: { en: "Hot water", es: "Agua caliente" },
  iron: { en: "Iron", es: "Plancha" },
  kitchen: { en: "Kitchen", es: "Cocina" },
  kitchenette: { en: "Kitchenette", es: "Cocineta" },
  laptop_friendly_workspace: { en: "Laptop-friendly workspace", es: "Espacio de trabajo para laptop" },
  laundromat_nearby: { en: "Laundromat nearby", es: "Lavandería cercana" },
  microwave: { en: "Microwave", es: "Microondas" },
  on_site_laundry_paid: { en: "On-site laundry (coin-operated, paid)", es: "Lavandería en el lugar (con monedas, de pago)" },
  oven: { en: "Oven", es: "Horno" },
  private_entrance: { en: "Private entrance", es: "Entrada privada" },
  private_living_room: { en: "Private living room", es: "Sala privada" },
  refrigerator: { en: "Refrigerator", es: "Refrigerador" },
  shampoo: { en: "Shampoo", es: "Champú" },
  shower_gel: { en: "Shower gel", es: "Gel de ducha" },
  smoke_detector: { en: "Smoke detector", es: "Detector de humo" },
  stove: { en: "Stove", es: "Estufa" },
  toaster: { en: "Toaster", es: "Tostadora" },
  tv: { en: "TV", es: "TV" },
  wardrobe_or_closet: { en: "Wardrobe or closet", es: "Armario o clóset" },
  washer: { en: "Washer", es: "Lavadora" },
  wifi: { en: "Wi-Fi", es: "Wi-Fi" },
}

function labelForAmenity(amenity: string, locale: string) {
  const known = AMENITY_LABELS[amenity]
  if (known) return locale === "es" ? known.es : known.en

  return amenity
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function UnitAmenities({ amenities }: { amenities?: string[] }) {
  const t = useTranslations("unitPage.amenities")
  const locale = useLocale()

  if (!amenities || amenities.length === 0) {
    return null
  }

  return (
    <section className="rounded-2xl border border-primary/10 bg-white p-6">
      <header className="mb-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">{t("heading")}</h2>
        <p className="mt-1 text-sm text-primary/70">{t("subheading")}</p>
      </header>

      <ul className="flex flex-wrap gap-2">
        {amenities.map((amenity) => (
          <li
            key={amenity}
            className="inline-flex items-center rounded-full border border-primary/15 bg-sand-fade px-3 py-1.5 text-xs font-medium text-primary"
          >
            {labelForAmenity(amenity, locale)}
          </li>
        ))}
      </ul>
    </section>
  )
}
