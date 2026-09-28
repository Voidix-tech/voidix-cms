import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import type { TrackingTableCounts } from "@/lib/journey/maintenance";
import {
  clearAllTrackingAction,
  clearHeatmapsAction,
} from "@/app/(panel)/user-activity/actions";

interface ClearTrackingSectionProps {
  counts: TrackingTableCounts;
}

/**
 * Administrative control to purge previous tracking data.
 *
 * ── ⚠ IRREVERSIBLE ACTION ─────────────────────────────────────────────────────────────────────
 * Deletes real analytics data from the database. Each button is protected by a native confirmation
 * dialog so an administrator cannot trigger it accidentally.
 */
export default function ClearTrackingSection({ counts }: ClearTrackingSectionProps) {
  const hasHeatmaps = counts.gridsCount > 0 || counts.pathsCount > 0;
  const hasAnyData = counts.totalCount > 0;

  return (
    <section className="rounded-sm border border-danger/25 bg-card/30 p-5 sm:p-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-sm font-bold text-danger">
          Clear tracking data
        </h2>
        <p className="max-w-2xl text-xs leading-relaxed text-muted">
          Permanently delete accumulated analytics data. This removes records from the database
          immediately and resets user activity reports.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xs border border-border bg-card/60 p-3">
          <p className="text-[10px] tracking-wider text-muted uppercase">Raw events</p>
          <p className="mt-1 font-display text-xl font-bold text-fg">
            {counts.eventsCount.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xs border border-border bg-card/60 p-3">
          <p className="text-[10px] tracking-wider text-muted uppercase">Cursor heatmaps</p>
          <p className="mt-1 font-display text-xl font-bold text-fg">
            {counts.gridsCount.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xs border border-border bg-card/60 p-3">
          <p className="text-[10px] tracking-wider text-muted uppercase">Cursor paths</p>
          <p className="mt-1 font-display text-xl font-bold text-fg">
            {counts.pathsCount.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xs border border-border bg-card/60 p-3">
          <p className="text-[10px] tracking-wider text-muted uppercase">Daily rollups</p>
          <p className="mt-1 font-display text-xl font-bold text-fg">
            {counts.dailyCount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <form action={clearAllTrackingAction}>
          <ConfirmSubmitButton
            confirmMessage={
              `Are you sure you want to permanently clear ALL previous tracking? ` +
              `This will delete ${counts.eventsCount.toLocaleString()} events, ` +
              `${counts.gridsCount.toLocaleString()} heatmaps, ` +
              `${counts.pathsCount.toLocaleString()} cursor paths, and ` +
              `${counts.dailyCount.toLocaleString()} daily rollups. This cannot be undone.`
            }
            pendingLabel="Clearing all tracking…"
          >
            Clear all previous tracking
          </ConfirmSubmitButton>
        </form>

        {hasHeatmaps && (
          <form action={clearHeatmapsAction}>
            <ConfirmSubmitButton
              confirmMessage={
                `Are you sure you want to clear cursor heatmaps and paths? ` +
                `This will delete ${counts.gridsCount.toLocaleString()} heatmap grids and ` +
                `${counts.pathsCount.toLocaleString()} cursor paths. General event counts and funnels will be preserved.`
              }
              pendingLabel="Clearing heatmaps…"
            >
              Clear heatmaps only
            </ConfirmSubmitButton>
          </form>
        )}

        {!hasAnyData && (
          <span className="text-xs text-muted">
            No previous tracking data recorded yet.
          </span>
        )}
      </div>
    </section>
  );
}
