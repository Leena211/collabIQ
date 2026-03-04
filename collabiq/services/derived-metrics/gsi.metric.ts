// ============================================================
// gsi.metric.ts  — TRD Section 6.5
// Growth Sustainability Index (GSI)
//
// Distinguishes organic, sustained growth from anomalous spikes.
//
// Formula:
//   GSI = (growthNormalised × 0.50)
//       + (authenticityScore × 0.30)
//       - (spikePenalty × 0.20)
//
// sustainableGrowth = GSI ≥ 50 AND NOT suspiciousSpike
// ============================================================

import { GSIOutput } from "@/types/global.types";

const W = { growth: 0.50, authenticity: 0.30, spike: 0.20 };

export function calcGSI(
  growthNormalised:  number,
  authenticityScore: number,
  suspiciousSpike:   boolean
): GSIOutput {
  const spikePenalty = suspiciousSpike ? 100 : 0;
  const score = Math.round(Math.min(100, Math.max(0,
    W.growth       * growthNormalised  +
    W.authenticity * authenticityScore -
    W.spike        * spikePenalty
  )));

  const sustainableGrowth = score >= 50 && !suspiciousSpike;

  const explanation =
    sustainableGrowth
      ? `GSI of ${score}/100 indicates organic, sustained growth trajectory.`
      : suspiciousSpike
      ? `Growth spike detected. GSI of ${score}/100 — growth may not be organic.`
      : `GSI of ${score}/100 suggests limited or declining growth momentum.`;

  return { score, sustainableGrowth, explanation };
}
