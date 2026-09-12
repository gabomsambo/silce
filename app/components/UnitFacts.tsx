import { useLocale, useTranslations } from "next-intl"
import { Bed, Bath, Home, Users, ArrowUp, Maximize2 } from "lucide-react"
import {
  buildBedroomsSpec,
  translateBedType,
  translateFloor,
} from "@/app/data/copy"
import type { Unit } from "@/app/data/units"

const ROOM_TYPE_LABELS: Record<string, { en: string; es: string }> = {
  backyard: { en: "Backyard", es: "Patio trasero" },
  bedroom: { en: "Bedroom", es: "Habitación" },
  exterior: { en: "Exterior", es: "Exterior" },
  full_bathroom: { en: "Full bathroom", es: "Baño completo" },
  kitchen: { en: "Kitchen", es: "Cocina" },
  kitchenette: { en: "Kitchenette", es: "Cocineta" },
  laundry_room: { en: "Laundry room", es: "Cuarto de lavado" },
  living_room: { en: "Living room", es: "Sala" },
  patio: { en: "Patio", es: "Patio" },
  studio: { en: "Studio", es: "Estudio" },
}

const BED_TYPE_LABELS: Record<string, { en: string; es: string }> = {
  double_bed: { en: "Double bed", es: "Cama matrimonial" },
  queen_bed: { en: "Queen bed", es: "Cama queen" },
  sofa_bed: { en: "Sofa bed", es: "Sofá cama" },
}

function localizeToken(
  token: string,
  labels: Record<string, { en: string; es: string }>,
  locale: "en" | "es"
) {
  const known = labels[token]
  if (known) return locale === "es" ? known.es : known.en
  return token.replace(/_/g, " ")
}

/**
 * Surfaces per-unit facts and listing-backed content on the unit page.
 *
 * The cards cover high-signal specs (bed, layout, bathrooms, guests, floor,
 * and square footage when provided). Long-form description, room-by-room
 * details, and house rules all come directly from unit data so this section
 * no longer depends on category-level template copy.
 */
export default function UnitFacts({
  unit,
  tRoot,
}: {
  unit: Unit
  tRoot: (key: string, values?: Record<string, string | number>) => string
}) {
  const t = useTranslations("unitPage.facts")
  const locale = useLocale() === "es" ? "es" : "en"

  const facts = [
    {
      key: "bed",
      label: t("bed"),
      value: translateBedType(unit.bedType, tRoot),
      Icon: Bed,
    },
    {
      key: "layout",
      label: t("layout"),
      value: buildBedroomsSpec(unit.bedrooms, tRoot),
      Icon: Home,
    },
    {
      key: "bathroom",
      label: t("bathroom"),
      value: t("privateBath", { count: unit.bathrooms }),
      Icon: Bath,
    },
    {
      key: "sleeps",
      label: t("sleeps"),
      value: t("guests", { count: unit.maxGuests }),
      Icon: Users,
    },
  ]
  if (unit.floor) {
    facts.push({
      key: "floor",
      label: t("floor"),
      value: translateFloor(unit.floor, tRoot),
      Icon: unit.floor.toLowerCase() === "upper" ? ArrowUp : Maximize2,
    })
  }

  if (unit.squareFootage) {
    facts.push({
      key: "sqft",
      label: t("squareFootage"),
      value: t(unit.squareFootage.approximate ? "squareFootageApprox" : "squareFootageExact", {
        value: unit.squareFootage.value,
      }),
      Icon: Home,
    })
  }

  return (
    <section id="space" className="scroll-mt-20 py-2">
      <header className="mb-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
          {t("heading")}
        </h2>
        <p className="mt-1 text-sm text-primary/70">{t("subheading")}</p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {facts.map(({ key, label, value, Icon }) => (
          <div
            key={key}
            className="rounded-2xl border border-primary/10 bg-white p-4"
          >
            <Icon aria-hidden="true" className="h-5 w-5 text-tan-ink" />
            <div className="mt-2 text-base font-bold text-primary">{value}</div>
            <div className="text-xs text-primary/70">{label}</div>
          </div>
        ))}
      </div>

      {unit.summary || unit.description ? (
        <div className="mt-6 rounded-2xl border border-primary/10 bg-white p-5">
          <h3 className="text-lg font-bold text-primary">{t("aboutHeading")}</h3>
          {unit.summary ? (
            <p className="mt-2 text-base font-medium leading-relaxed text-primary/90">{unit.summary}</p>
          ) : null}
          {unit.description ? (
            <p className="mt-2 text-sm leading-relaxed text-primary/80">{unit.description}</p>
          ) : null}
        </div>
      ) : null}

      {unit.roomDetails && unit.roomDetails.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-primary/10 bg-white p-5">
          <h3 className="text-lg font-bold text-primary">{t("roomsHeading")}</h3>
          <div className="mt-3 space-y-3">
            {unit.roomDetails.map((room, index) => (
              <div key={`${room.type}-${index}`} className="rounded-xl border border-primary/10 bg-sand-fade p-3">
                <p className="text-sm font-semibold text-primary">
                  {localizeToken(room.type, ROOM_TYPE_LABELS, locale)}
                </p>
                {room.beds && room.beds.length > 0 ? (
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {room.beds.map((bed, bedIndex) => (
                      <li
                        key={`${bed.type}-${bedIndex}`}
                        className="inline-flex items-center rounded-full border border-primary/15 bg-white px-3 py-1 text-xs font-medium text-primary"
                      >
                        {t("roomBed", {
                          quantity: bed.quantity,
                          type: localizeToken(bed.type, BED_TYPE_LABELS, locale),
                        })}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {unit.houseRules ? (
        <div className="mt-6 rounded-2xl border border-primary/10 bg-white p-5">
          <h3 className="text-lg font-bold text-primary">{t("houseRulesHeading")}</h3>
          <ul className="mt-3 space-y-1 text-sm text-primary/80">
            <li>{t("ruleCheckin", { time: unit.houseRules.checkinTime })}</li>
            <li>{t("ruleCheckout", { time: unit.houseRules.checkoutTime })}</li>
            <li>{t("ruleQuietHours", { time: unit.houseRules.quietHoursStart })}</li>
            <li>{t("rulePets", { value: unit.houseRules.petsAllowed ? t("yes") : t("no") })}</li>
            <li>{t("ruleSmoking", { value: unit.houseRules.smokingAllowed ? t("yes") : t("no") })}</li>
            <li>{t("ruleEvents", { value: unit.houseRules.eventsAllowed ? t("yes") : t("no") })}</li>
          </ul>
        </div>
      ) : null}
    </section>
  )
}
