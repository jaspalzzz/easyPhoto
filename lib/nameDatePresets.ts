import type { PortalSpec } from "@/lib/portalPresets";
import { allPortalSpecs, photoDimsPx } from "@/lib/specRegistry";

export interface NameDatePreset {
  id: string;
  name: string;
  specId: string;
  width: number | null;
  height: number | null;
  ar: number;
  kb: number;
  minKb: number | null;
  /** Published fixed strip height, when the authority specifies one. */
  stripHeightPx: number | null;
}

const DEFAULT_AR = 3.5 / 4.5;

/**
 * Build the name/date tool's portal choices from the registry flag. A newly
 * verified portal therefore appears automatically instead of requiring a
 * second manually-maintained list in the tool component.
 */
export function buildNameDatePresets(
  specs: PortalSpec[] = allPortalSpecs()
): NameDatePreset[] {
  return specs
    .filter((spec) => spec.requiresNameDate === true)
    .map((spec) => {
      const dims = photoDimsPx(spec) ?? "";
      const kbRange = spec.photoMinKb
        ? `${spec.photoMinKb}–${spec.photoLimitKb} KB`
        : `≤${spec.photoLimitKb} KB`;
      const detail = [dims, kbRange].filter(Boolean).join(", ");
      const stripMatch = spec.description.match(/lower\s+(\d+)\s*px/i);
      const stripHeightPx = stripMatch ? Number(stripMatch[1]) : null;

      return {
        id: spec.id,
        name: detail ? `${spec.name} (${detail})` : spec.name,
        specId: spec.id,
        width: spec.photoWidthPx ?? null,
        height: spec.photoHeightPx ?? null,
        ar:
          spec.photoWidthPx && spec.photoHeightPx
            ? spec.photoWidthPx /
              Math.max(
                1,
                spec.photoHeightPx -
                  (stripHeightPx ?? Math.round(spec.photoHeightPx * 0.15))
              )
            : spec.photoAspectRatio ?? DEFAULT_AR,
        kb: spec.photoLimitKb,
        minKb: spec.photoMinKb ?? null,
        stripHeightPx,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const NAME_DATE_PRESETS = buildNameDatePresets();
