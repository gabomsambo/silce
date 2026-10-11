import {
  parseUnitDescriptionBlocks,
  type UnitDescriptionBlock,
} from "@/lib/unitDescriptionProse"

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 rounded-xl border border-primary/10 bg-sand-fade/60 p-3">
      {items.map((item, index) => (
        <li key={`${index}-${item.slice(0, 24)}`} className="text-sm leading-relaxed text-primary/85">
          {item}
        </li>
      ))}
    </ul>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1 pl-5 text-sm leading-relaxed text-primary/80">
      {items.map((item, index) => (
        <li key={`${index}-${item.slice(0, 24)}`}>{item}</li>
      ))}
    </ul>
  )
}

function DescriptionBlock({ block }: { block: UnitDescriptionBlock }) {
  if (block.type === "prose") {
    return <p className="text-sm leading-relaxed text-primary/80">{block.text}</p>
  }
  if (block.type === "features") {
    return <FeatureList items={block.items} />
  }
  return <BulletList items={block.items} />
}

export default function UnitDescriptionProse({ description }: { description: string }) {
  const blocks = parseUnitDescriptionBlocks(description)
  if (blocks.length === 0) return null

  return (
    <div className="mt-2 space-y-4">
      {blocks.map((block, index) => (
        <DescriptionBlock key={index} block={block} />
      ))}
    </div>
  )
}
