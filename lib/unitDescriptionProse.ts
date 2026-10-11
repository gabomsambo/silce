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

function isPlainProseLine(line: string) {
  return line.trim().length > 0 && !isFeatureLine(line) && !isBulletLine(line) && !isDividerLine(line)
}

function lineEndsSentence(line: string) {
  return /[.!?…]["”')\]]*$/.test(line.trim())
}

function isIndentedLine(line: string) {
  return /^\s+\S/.test(line)
}

function isNewLabelLine(line: string) {
  const match = /^([^:]{1,24}):/.exec(line.trim())
  if (!match) return false
  const clause = match[1].trim()
  return clause.length > 0 && clause.length <= 24
}

function startsWithLowercaseLetter(text: string) {
  const char = text.charAt(0)
  return char.toLowerCase() !== char.toUpperCase() && char === char.toLowerCase()
}

function startsWithUppercaseLetter(text: string) {
  const char = text.charAt(0)
  return char.toLowerCase() !== char.toUpperCase() && char === char.toUpperCase()
}

function isListContinuation(line: string) {
  if (!isPlainProseLine(line) || isNewLabelLine(line)) return false
  if (isIndentedLine(line)) return true
  return startsWithLowercaseLetter(line.trim())
}

function readMarkedItem(lines: string[], start: number): { text: string; nextIndex: number } {
  const parts = [lines[start].trim()]
  let index = start + 1
  while (index < lines.length && isListContinuation(lines[index])) {
    parts.push(lines[index].trim())
    index += 1
  }
  return { text: parts.join(" "), nextIndex: index }
}

function readMarkedList(
  lines: string[],
  start: number,
  isMarkerLine: (line: string) => boolean,
): { items: string[]; nextIndex: number } {
  const items: string[] = []
  let index = start
  while (index < lines.length && isMarkerLine(lines[index])) {
    const item = readMarkedItem(lines, index)
    items.push(item.text)
    index = item.nextIndex
    while (index < lines.length && lines[index].trim().length === 0) {
      index += 1
    }
  }
  return { items, nextIndex: index }
}

function isShortTitle(line: string) {
  const trimmed = line.trim()
  if (trimmed.length === 0 || trimmed.length > 24) return false
  if (lineEndsSentence(trimmed)) return false
  return startsWithUppercaseLetter(trimmed)
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
      const list = readMarkedList(lines, index, isFeatureLine)
      blocks.push({ type: "features", items: list.items })
      index = list.nextIndex
      continue
    }

    if (isBulletLine(line)) {
      const list = readMarkedList(lines, index, isBulletLine)
      blocks.push({ type: "bullets", items: list.items })
      index = list.nextIndex
      continue
    }

    const paragraph: string[] = []
    while (index < lines.length && isPlainProseLine(lines[index])) {
      if (
        paragraph.length > 0 &&
        isShortTitle(paragraph[paragraph.length - 1]) &&
        isShortTitle(lines[index])
      ) {
        break
      }
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
