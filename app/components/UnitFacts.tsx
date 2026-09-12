import { useTranslations } from "next-intl"
import { Bed, Bath, Home, Users, ArrowUp, Maximize2 } from "lucide-react"
import {
  buildBedroomsSpec,
  buildBathroomsSpec,
  translateBedType,
  translateExtra,
  translateFloor,
  type Translate,
} from "@/app/data/copy"
import type { Unit } from "@/app/data/units"

/**
 * Surfaces the per-unit facts that have always lived in `units.ts`
 * (bedType, floor, extras) and were never rendered on the unit page.
 *
 * Five fixed cards on desktop: Bed, Layout, Bathroom, Sleeps, Floor.
 * Extras (the unbounded list) render as a chip row underneath. The card
 * layout is the same shape used by Airbnb and Expedia and reads as the
 * minimum a guest needs before they decide to keep reading.
 *
 * No new data is required: every fact here is already sourced in
 * `units.ts` and translated via `copy.ts` (`translateBedType`,
 * `translateFloor`, `translateExtra`).
 */
export default function UnitFacts({
  unit,
  tRoot,
  blurb,
}: {
  unit: Unit
  tRoot: Translate
  blurb: string
}) {
  const t = useTranslations("unitPage.facts")

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

      {unit.extras && unit.extras.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {unit.extras.map((e) => (
            <span
              key={e}
              className="inline-flex items-center rounded-full border border-primary/15 bg-white px-3 py-1.5 text-xs font-medium text-primary"
            >
              {translateExtra(e, tRoot)}
            </span>
          ))}
        </div>
      ) : null}

      <p className="mt-5 text-base leading-relaxed text-primary/85 md:text-lg">
        {t("categoryDescription", { blurb })}
      </p>
    </section>
  )
}
