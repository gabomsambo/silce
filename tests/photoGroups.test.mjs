import assert from "node:assert/strict"
import test from "node:test"
import {
  buildPhotoGroups,
  getPhotoGroupBoundary,
} from "../lib/photoGroups.ts"

test("End selects the actual last photo in a non-contiguous room group", () => {
  // Unit 2528's kitchen is at indices 3, 4, and 7; its bathroom occupies 5
  // and 6. The old start + count calculation incorrectly landed on 5.
  const photos = [
    {}, {}, {},
    { group: "kitchen" },
    { group: "kitchen" },
    { group: "bathroom" },
    { group: "bathroom" },
    { group: "kitchen" },
  ]

  const groups = buildPhotoGroups(photos)

  assert.deepEqual(
    groups.find(({ group }) => group === "kitchen")?.indices,
    [3, 4, 7],
  )
  assert.equal(getPhotoGroupBoundary(groups, 3, "last"), 7)
  assert.equal(getPhotoGroupBoundary(groups, 7, "first"), 3)
})

test("unlabelled photos remain flat instead of acquiring inferred groups", () => {
  assert.deepEqual(buildPhotoGroups([{}, {}, {}]), [])
  assert.equal(getPhotoGroupBoundary([], 0, "last"), undefined)
})
