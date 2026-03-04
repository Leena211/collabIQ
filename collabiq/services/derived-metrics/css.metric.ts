// ============================================================
// css.metric.ts  — TRD Section 6.5
// Collaboration Stability Score (CSS)
//
// Measures how reliable a creator is as a long-term partner.
// Combines consistency, authenticity, and trend signals.
//
// Formula:
//   CSS = (consistencyScore × 0.40)
//       + (authenticityScore × 0.35)
//       + (trendBonus × 0.25)
//
// trendBonus: RISING=100, STABLE=60, FALLING=20
// Labels: ≥80 EXCELLENT | ≥60 GOOD | ≥40 FAIR | <40 POOR
// ============================================================

import { CSSOutput } from "@/types/global.types";

const TREND_BONUS = { RISING: 100, STABLE: 60, FALLING: 20 } as const;
const W           = { consistency: 0.40, authenticity: 0.35, trend: 0.25 };

function label(score: number): CSSOutput["label"] {
  if (score >= 80) return "EXCELLENT";
  if (score >= 60) return "GOOD";
  if (score >= 40) return "FAIR";
  return "POOR";
}

export function calcCSS(
  consistencyScore:  number,
  authenticityScore: number,
  trend:             "RISING" | "FALLING" | "STABLE"
): CSSOutput {
  const score = Math.round(
    W.consistency   * consistencyScore  +
    W.authenticity  * authenticityScore +
    W.trend         * TREND_BONUS[trend]
  );

  const l = label(score);
  const explanation =
    l === "EXCELLENT" ? "Highly stable collaboration candidate with consistent, authentic engagement." :
    l === "GOOD"      ? "Solid collaboration partner. Minor inconsistencies are within acceptable range." :
    l === "FAIR"      ? "Some instability detected. Consider a short-term or trial campaign first." :
                        "Significant instability signals. High collaboration risk — further vetting required.";

  return { score, label: l, explanation };
}
