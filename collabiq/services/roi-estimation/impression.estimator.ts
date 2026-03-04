// ============================================================
// impression.estimator.ts  — TRD Section 9
// Estimates organic impressions per sponsored post.
//
// Instagram:  reach ≈ followers × reachRate (default 0.25)
// YouTube:    reach ≈ avgViews (already per-video metric)
// ============================================================

import { RawMetricsSnapshot } from "@/types/global.types";

const DEFAULT_IG_REACH_RATE = 0.25; // 25% of followers see an average post

export function estimateImpressions(m: RawMetricsSnapshot): number {
  if (m.platform === "YOUTUBE") {
    return Math.round(m.avgViews ?? m.followers * 0.10);
  }
  const rate = m.reachRate ?? DEFAULT_IG_REACH_RATE;
  return Math.round(m.followers * rate);
}
