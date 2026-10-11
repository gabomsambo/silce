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

test("hard-wrapped feature and bullet lines stay one item", () => {
  const sample = [
    "▸ Sleeping Area: Queen bed with premium linens,",
    "and A/C for a restful night's sleep",
    "▸ Kitchenette: Mini fridge, microwave, full-size oven, sink, drip",
    "coffee maker, toaster, and full set of utensils — everything you",
    "need for easy home-style meals",
    "▸ PARKING: One spot is included. Additional parking is available ",
    "  for $10/night, subject to availability — please request in advance.",
    "▸ ACCESO AL RÍO: El río Indian está cerca, pero no hay",
    "  Acceso directo al agua desde la propiedad.",
    "",
    "• Kitchenette: sink, drip",
    "coffee maker and utensils",
    "  for easy meals",
  ].join("\n")
  const blocks = parseUnitDescriptionBlocks(sample)
  assert.equal(blocks[0].type, "features")
  assert.equal(blocks[0].items.length, 4)
  assert.equal(
    blocks[0].items[0],
    "▸ Sleeping Area: Queen bed with premium linens, and A/C for a restful night's sleep",
  )
  assert.equal(
    blocks[0].items[1],
    "▸ Kitchenette: Mini fridge, microwave, full-size oven, sink, drip coffee maker, toaster, and full set of utensils — everything you need for easy home-style meals",
  )
  assert.match(blocks[0].items[2], /available for \$10\/night, subject to availability/)
  assert.match(blocks[0].items[3], /no hay Acceso directo/)
  assert.equal(blocks[1].type, "bullets")
  assert.equal(blocks[1].items.length, 1)
  assert.match(blocks[1].items[0], /drip coffee maker and utensils for easy meals/)
})

test("a finished sentence or a new label ends the open item", () => {
  const sample = [
    "▸ Área para dormir: cama tamaño queen con ropa de cama de primera calidad,",
    "y aire acondicionado para un sueño reparador",
    "asientos lujosos: ideales para relajarse después de un día completo",
    "▸ Cocina básica: Mininevera, microondas, horno grande, fregadero, goteo.",
    "cafetera, tostadora y juego completo de utensilios",
  ].join("\n")
  const blocks = parseUnitDescriptionBlocks(sample)
  assert.equal(blocks[0].type, "features")
  assert.equal(blocks[0].items.length, 1)
  assert.match(blocks[0].items[0], /calidad, y aire acondicionado/)
  assert.equal(blocks[0].items[0].includes("asientos lujosos"), false)
  assert.equal(blocks[1].type, "prose")
  assert.equal(
    blocks[1].text,
    "asientos lujosos: ideales para relajarse después de un día completo",
  )
  assert.equal(blocks[2].type, "features")
  assert.equal(
    blocks[2].items[0],
    "▸ Cocina básica: Mininevera, microondas, horno grande, fregadero, goteo.",
  )
  assert.equal(blocks[3].type, "prose")
  assert.equal(blocks[3].text, "cafetera, tostadora y juego completo de utensilios")
})

test("adjacent short headings stay separate and narrative wraps stay joined", () => {
  const sample = [
    "Welcome to our studio in the vibrant Eau Gallie Arts",
    "District — one of Melbourne's most walkable and character-filled",
    "neighborhoods.",
    "",
    "LOCAL FAVORITES",
    "Food & Drink",
    "",
    "FAVORITOS LOCALES",
    "Comida y bebida",
  ].join("\n")
  const blocks = parseUnitDescriptionBlocks(sample)
  assert.equal(blocks.length, 5)
  assert.equal(
    blocks[0].text,
    "Welcome to our studio in the vibrant Eau Gallie Arts District — one of Melbourne's most walkable and character-filled neighborhoods.",
  )
  assert.equal(blocks[1].text, "LOCAL FAVORITES")
  assert.equal(blocks[2].text, "Food & Drink")
  assert.equal(blocks[3].text, "FAVORITOS LOCALES")
  assert.equal(blocks[4].text, "Comida y bebida")
})

test("owner snapshots keep wrapped amenity lines and heading breaks", () => {
  const english = hospitableUnits.units.find((unit) => unit.name === "Unit PA103 Ed 2546")
  const spanish = spanishById["2282916"]
  assert.ok(english?.description)
  assert.ok(spanish?.description)

  const enBlocks = parseUnitDescriptionBlocks(english.description)
  const enItems = enBlocks.filter((block) => block.type === "features").flatMap((block) => block.items)
  const sleeping = enItems.find((item) => item.includes("Sleeping Area:"))
  const kitchen = enItems.find((item) => item.includes("Kitchenette:"))
  const parking = enItems.find((item) => item.includes("PARKING:"))
  assert.ok(sleeping?.includes("and A/C for a restful night's sleep"))
  assert.ok(kitchen?.includes("sink, drip coffee maker"))
  assert.ok(kitchen?.includes("need for easy home-style meals"))
  assert.ok(parking?.includes("for $10/night, subject to availability — please request in advance."))
  assert.equal(
    enBlocks.some(
      (block) => block.type === "prose" && block.text === "and A/C for a restful night's sleep",
    ),
    false,
  )
  assert.equal(
    enBlocks.some((block) => block.type === "prose" && block.text === "LOCAL FAVORITES"),
    true,
  )
  assert.equal(
    enBlocks.some((block) => block.type === "prose" && block.text === "Food & Drink"),
    true,
  )
  assert.equal(
    enBlocks.some(
      (block) =>
        block.type === "prose" && block.text.includes("LOCAL FAVORITES") && block.text.includes("Food"),
    ),
    false,
  )
  const welcome = enBlocks.find(
    (block) => block.type === "prose" && block.text.includes("Eau Gallie Arts"),
  )
  assert.match(welcome.text, /Eau Gallie Arts District —/)

  const esBlocks = parseUnitDescriptionBlocks(spanish.description)
  const esItems = esBlocks.filter((block) => block.type === "features").flatMap((block) => block.items)
  const dormir = esItems.find((item) => item.includes("Área para dormir:"))
  assert.ok(dormir?.includes("y aire acondicionado para un sueño reparador"))
  assert.equal(dormir.includes("asientos lujosos"), false)
  assert.equal(
    esBlocks.some(
      (block) =>
        block.type === "prose" &&
        block.text === "asientos lujosos: ideales para relajarse después de un día completo",
    ),
    true,
  )
  assert.equal(
    esBlocks.some((block) => block.type === "prose" && block.text === "FAVORITOS LOCALES"),
    true,
  )
  assert.equal(
    esBlocks.some((block) => block.type === "prose" && block.text === "Comida y bebida"),
    true,
  )
  assert.equal(
    esBlocks.some(
      (block) =>
        block.type === "prose" &&
        block.text.includes("FAVORITOS LOCALES") &&
        block.text.includes("Comida y bebida"),
    ),
    false,
  )
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
