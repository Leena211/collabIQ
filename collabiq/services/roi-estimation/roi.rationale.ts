// ============================================================
// roi.rationale.ts  — TRD Section 9
// Builds a plain-language rationale string for the ROI estimate.
// This is NOT AI-generated — it is template-driven from data.
// ============================================================

import { ROIBand } from "@/types/global.types";

export function buildROIRationale(
  band:                ROIBand,
  estimatedReturn:     string,
  estimatedImpressions:number,
  estimatedClicks:     number,
  estimatedConversions:number,
  niche:               string
): string {
  return (
    `Estimated ${estimatedImpressions.toLocaleString()} impressions, ` +
    `${estimatedClicks.toLocaleString()} clicks, and ` +
    `${estimatedConversions.toLocaleString()} conversions per sponsored post ` +
    `in the ${niche} niche. ` +
    `ROI band: ${band} (${estimatedReturn} estimated return). ` +
    `Based on platform reach model, niche CTR benchmarks, and purchase intent score.`
  );
}
