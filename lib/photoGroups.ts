export const PHOTO_GROUP_ORDER = [
  "studio",
  "living",
  "bedroom",
  "kitchen",
  "bathroom",
  "grounds",
  "neighbourhood",
] as const

export type PhotoGroupKey = (typeof PHOTO_GROUP_ORDER)[number]

export interface GroupablePhoto {
  group?: PhotoGroupKey
}

export interface PhotoGroup {
  group: PhotoGroupKey
  indices: number[]
}

/**
 * Preserve the gallery's inherited source order while recording every actual
 * photo index in a group. A group is never represented as start + count:
 * room photos can be interleaved with another room's photos.
 */
export function buildPhotoGroups(photos: readonly GroupablePhoto[]): PhotoGroup[] {
  return PHOTO_GROUP_ORDER.flatMap((group) => {
    const indices = photos.flatMap((photo, index) =>
      photo.group === group ? [index] : [],
    )
    return indices.length > 0 ? [{ group, indices }] : []
  })
}

export function getPhotoGroupBoundary(
  groups: readonly PhotoGroup[],
  photoIndex: number,
  boundary: "first" | "last",
): number | undefined {
  const photoGroup = groups.find(({ indices }) => indices.includes(photoIndex))
  if (!photoGroup) return undefined
  return boundary === "first"
    ? photoGroup.indices[0]
    : photoGroup.indices[photoGroup.indices.length - 1]
}
