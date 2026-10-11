import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"
import {
  flattenUnitDescriptionBlocks,
  normalizeUnitDescriptionText,
  parseUnitDescriptionBlocks,
} from "../lib/unitDescriptionProse.ts"

const hospitableUnits = JSON.parse(
  readFileSync(new URL("../app/data/hospitable-units.json", import.meta.url), "utf8"),
)
const spanishById = JSON.parse(
  readFileSync(new URL("../app/data/hospitable-unit-content.es.json", import.meta.url), "utf8"),
)

function assertPreserved(label, description) {
  const blocks = parseUnitDescriptionBlocks(description)
  const flattened = flattenUnitDescriptionBlocks(blocks)
  assert.equal(
    normalizeUnitDescriptionText(description),
    normalizeUnitDescriptionText(flattened),
    `text changed for ${label}`,
  )
}

test("parse + flatten preserves every unit description (EN and ES) modulo whitespace", () => {
  for (const unit of hospitableUnits.units) {
    assertPreserved(`${unit.name} (en)`, unit.description)
  }
  for (const [id, content] of Object.entries(spanishById)) {
    if (content.description) assertPreserved(`${id} (es)`, content.description)
  }
})

test("feature and bullet runs split without dropping characters", () => {
  const sample =
    "THE SPACE (~296 sq ft)\n\n▸ Sleeping Area: linens\n▸ Kitchenette: essentials\n\nExtras\n──────\n▸ Parking\n\nHello world.\n\n• One\n• Two"
  const blocks = parseUnitDescriptionBlocks(sample)
  assert.equal(blocks[0].type, "prose")
  assert.equal(blocks[1].type, "features")
  assert.equal(blocks[1].items.length, 2)
  assert.equal(blocks[2].type, "prose")
  assert.equal(blocks[3].type, "features")
  assert.equal(blocks[4].type, "prose")
  assert.equal(blocks[5].type, "bullets")
  assert.equal(
    normalizeUnitDescriptionText(sample),
    normalizeUnitDescriptionText(flattenUnitDescriptionBlocks(blocks)),
  )
})
