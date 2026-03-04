// ============================================================
// consistency.score.ts  — TRD Section 6
// Measures posting regularity and engagement stability.
//
// Consistency score = 1 - CoeffVariation(postGaps), clamped 0–1
// Posting frequency = totalPosts / (observationDays / 7)
// Volatility        = σ of engagement rate history
// ============================================================

import { ConsistencyScoreOutput } from "@/types/global.types";

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.map((v) => Math.pow(v - mean, 2)).reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(variance);
}

export function calcConsistencyScore(
  totalPosts:      number,
  observationDays: number,
  erHistory:       number[],  // oldest → newest
  postDatesDesc:   Date[]     // newest → oldest post timestamps
): ConsistencyScoreOutput {
  // Posting frequency (posts/week)
  const postingFrequency = observationDays > 0
    ? totalPosts / (observationDays / 7)
    : 0;

  // Volatility = σ of engagement history
  const volatility = stdDev(erHistory);

  // Consistency score from gap regularity
  let score = 50; // default when insufficient data
  if (postDatesDesc.length >= 2) {
    const gaps: number[] = [];
    for (let i = 0; i < postDatesDesc.length - 1; i++) {
      gaps.push((postDatesDesc[i].getTime() - postDatesDesc[i + 1].getTime()) / 3_600_000);
    }
    const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const cv   = mean > 0 ? stdDev(gaps) / mean : 1;
    score = Math.round(Math.max(0, Math.min(100, (1 - cv) * 100)));
  }

  return { score, postingFrequency: Math.round(postingFrequency * 10) / 10, volatility };
}
