/** Canonical owners from approved BRDs; a link never transfers ownership. */
export const resourceOwners = {
  photobook: "M01",
  page: "M01",
  diary: "M01",
  publication: "M01",
  asset: "M02",
  album: "M02",
  asset_variant: "M02",
  place: "M03",
  place_wishlist: "M03",
  date_plan: "M03",
  visit: "M03",
  review: "M03",
  trip: "M04",
  activity: "M04",
  booking: "M04",
  packing_item: "M04",
  calendar_event: "M05",
  event_series: "M05",
  event_occurrence: "M05",
  anniversary: "M05",
  wish: "M06",
  goal: "M06",
  task: "M06",
  milestone: "M06",
  expense: "M07",
  budget: "M07",
  savings: "M07",
  settlement: "M07",
  moment: "M08",
  letter: "M08",
  surprise: "M08",
  capsule: "M08",
  comment: "M09",
  reaction: "M09",
  account: "M10",
  profile: "M10",
  space: "M10",
  permission: "M10",
  notification: "M10",
} as const;

export type ResourceType = keyof typeof resourceOwners;
export type ModuleId = (typeof resourceOwners)[ResourceType];
export type ResourceRef = Readonly<{ type: ResourceType; id: string }>;

export function canonicalOwner(resource: ResourceRef): ModuleId {
  const owner = resourceOwners[resource.type];
  if (!Object.hasOwn(resourceOwners, resource.type) || !owner) {
    throw new Error("Unknown resource type");
  }
  return owner;
}

export function assertCanonicalWriter(
  module: ModuleId,
  resource: ResourceRef,
): void {
  if (canonicalOwner(resource) !== module) {
    throw new Error("Cross-module canonical write denied");
  }
  // Ownership is routing only. Each domain must independently authorize actor,
  // source ACL, linked resources, lifecycle and business consent before writes.
}
