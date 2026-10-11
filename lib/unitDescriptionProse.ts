export type UnitDescriptionBlock =
  | { type: "prose"; text: string }
  | { type: "features"; items: string[] }
  | { type: "bullets"; items: string[] }

function isFeatureLine(line: string) {
  const trimmed = line.trim()
  return /^[\u25b8▸]/.test(trimmed)
}

function isBulletLine(line: string) {
  return /^•/.test(line.trim())
}

function isDividerLine(line: string) {
  const trimmed = line.trim()
  return trimmed.length > 0 && /^[\u2500─\-]+$/.test(trimmed)
}

/**
 * Splits owner listing prose into scannable blocks without changing wording.
 * Decorative divider lines (──────) are omitted from blocks; compare via
 * {@link normalizeUnitDescriptionText} when proving text preservation.
 */
export function parseUnitDescriptionBlocks(description: string): UnitDescriptionBlock[] {
  const lines = description.split("\n")
  const blocks: UnitDescriptionBlock[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim()) {
      index += 1
      continue
    }

    if (isDividerLine(line)) {
      index += 1
      continue
    }

    if (isFeatureLine(line)) {
      const items: string[] = []
      while (index < lines.length && isFeatureLine(lines[index])) {
        items.push(lines[index].trim())
        index += 1
      }
      blocks.push({ type: "features", items })
      continue
    }

    if (isBulletLine(line)) {
      const items: string[] = []
      while (index < lines.length && isBulletLine(lines[index])) {
        items.push(lines[index].trim())
        index += 1
      }
      blocks.push({ type: "bullets", items })
      continue
    }

    const paragraph: string[] = []
    while (
      index < lines.length &&
      lines[index].trim() &&
      !isFeatureLine(lines[index]) &&
      !isBulletLine(lines[index]) &&
      !isDividerLine(lines[index])
    ) {
      paragraph.push(lines[index].trim())
      index += 1
    }
    blocks.push({ type: "prose", text: paragraph.join(" ") })
  }

  return blocks
}

export function flattenUnitDescriptionBlocks(blocks: UnitDescriptionBlock[]): string {
  const parts: string[] = []
  for (const block of blocks) {
    if (block.type === "prose") {
      parts.push(block.text)
    } else {
      parts.push(...block.items)
    }
  }
  return parts.join(" ")
}

/** Collapses whitespace and decorative rule lines for preservation checks. */
export function normalizeUnitDescriptionText(text: string): string {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !isDividerLine(line))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
}
