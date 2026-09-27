"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import {
  clearAllJourneyTracking,
  clearHeatmapTracking,
} from "@/lib/journey/maintenance";

/**
 * Permanently deletes all tracking records across the four journey tables.
 *
 * ── ⚠ ADMIN ONLY ───────────────────────────────────────────────────────────────────────────────
 * Destroys all recorded user events, cursor heatmaps, cursor paths, and daily aggregates.
 */
export async function clearAllTrackingAction(): Promise<void> {
  await requireAdmin();

  const result = await clearAllJourneyTracking();

  console.info(
    `[journey] Cleared all tracking: deleted ${result.deletedEvents} events, ` +
      `${result.deletedGrids} grids, ${result.deletedPaths} paths, ${result.deletedDaily} daily rollups`,
  );

  revalidatePath("/user-activity");
  revalidatePath("/user-activity/heatmap");
  revalidatePath("/user-activity/attention");
}

/**
 * Permanently deletes only cursor heatmaps and cursor paths.
 */
export async function clearHeatmapsAction(): Promise<void> {
  await requireAdmin();

  const result = await clearHeatmapTracking();

  console.info(
    `[journey] Cleared heatmaps: deleted ${result.deletedGrids} grids, ${result.deletedPaths} paths`,
  );

  revalidatePath("/user-activity");
  revalidatePath("/user-activity/heatmap");
}
