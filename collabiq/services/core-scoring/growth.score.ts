// ============================================================
// growth.score.ts  — TRD Section 6
// Measures follower growth momentum.
//
// Formula:
//   growthRate = (current - previous) / previous × 100
//   Normalised: -5% → 0pts, +20% → 100pts (linear interpolation)
//   Trend: derived from last 5 ER values (±10% threshold)
// ============================================================

import { GrowthScoreOutput } from "@/types/global.types";

const GROWTH_FLOOR   = -5;  // -5% maps to 0
const GROWTH_CEILING = 20;  // +20% maps to 100

export function calcGrowthScore(
  currentFollowers:  number,
  previousFollowers: number,
  erHistory:         number[]  // oldest → newest ER values
): GrowthScoreOutput {
  const rawRate  = previousFollowers > 0
    ? ((currentFollowers - previousFollowers) / previousFollowers) * 100
    : 0;

  const normalised = Math.min(100, Math.max(0,
    ((rawRate - GROWTH_FLOOR) / (GROWTH_CEILING - GROWTH_FLOOR)) * 100
  ));

  const trend = deriveTrend(erHistory);

  return {
    rawRate:    Math.round(rawRate * 100) / 100,
    normalised: Math.round(normalised),
    trend,
  };
}

function deriveTrend(values: number[]): "RISING" | "FALLING" | "STABLE" {
  if (values.length < 2) return "STABLE";
  const recent = values.slice(-5);
  const first  = recent[0];
  const last   = recent[recent.length - 1];
  if (first === 0) return "STABLE";
  const pct = ((last - first) / first) * 100;
  if (pct >  10) return "RISING";
  if (pct < -10) return "FALLING";
  return "STABLE";
}
