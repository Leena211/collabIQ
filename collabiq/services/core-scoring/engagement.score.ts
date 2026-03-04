// ============================================================
// engagement.score.ts  — TRD Section 6
// Calculates Engagement Rate and normalises to 0–100.
//
// Formula:
//   ER = (avgLikes + avgComments + avgShares) / followers × 100
//   Normalised = clamp(ER / ER_CEILING × 100, 0, 100)
//
// ER_CEILING = 10% — accounts hitting 10%+ ER score 100.
// ============================================================

import { RawMetricsSnapshot, EngagementScoreOutput } from "@/types/global.types";

const ER_CEILING = 10; // 10% ER = perfect score

export function calcEngagementScore(m: RawMetricsSnapshot): EngagementScoreOutput {
  const interactions = m.avgLikes + m.avgComments + (m.avgShares ?? 0);
  const raw          = m.followers > 0 ? (interactions / m.followers) * 100 : 0;
  const normalised   = Math.min(100, Math.max(0, (raw / ER_CEILING) * 100));
  return { raw: Math.round(raw * 100) / 100, normalised: Math.round(normalised) };
}
