// ============================================================
// riskScore.calculator.ts  — TRD Section 6 (Risk separated)
// Aggregates risk flags into a score, level, and analysis.
//
// Severity → numeric penalty:
//   LOW = 10, MODERATE = 25, HIGH = 50
//
// Risk Level:
//   score < 30  → LOW
//   score < 60  → MODERATE
//   score ≥ 60  → HIGH
// ============================================================

import { RiskFlag, RiskAnalysisOutput } from "@/types/global.types";
import { flagFakeBotRisk, flagVolatility, flagSuspiciousSpike, flagEngagementDrop, flagGrowthAnomaly } from "./riskFlags.detector";

const SEVERITY_PTS = { LOW: 10, MODERATE: 25, HIGH: 50 } as const;

function movingAvg(vals: number[], n = 3): number {
  if (!vals.length) return 0;
  const s = vals.slice(-n);
  return s.reduce((a, b) => a + b, 0) / s.length;
}

function trend(vals: number[]): "RISING" | "FALLING" | "STABLE" {
  if (vals.length < 2) return "STABLE";
  const r = vals.slice(-5);
  const pct = r[0] > 0 ? ((r[r.length - 1] - r[0]) / r[0]) * 100 : 0;
  return pct > 10 ? "RISING" : pct < -10 ? "FALLING" : "STABLE";
}

export function calcRiskAnalysis(
  fakeBotRisk:    number,
  volatility:     number,
  suspiciousSpike:boolean,
  growthRate:     number,
  currentER:      number,
  erHistory:      number[]
): RiskAnalysisOutput {
  const movingAvgEngagement = movingAvg(erHistory);
  const engagementTrend     = trend(erHistory);

  const flags: RiskFlag[] = [
    flagFakeBotRisk(fakeBotRisk),
    flagVolatility(volatility),
    flagSuspiciousSpike(suspiciousSpike),
    flagEngagementDrop(currentER, movingAvgEngagement),
    flagGrowthAnomaly(growthRate),
  ].filter((f): f is RiskFlag => f !== null);

  const score = Math.min(100, flags.reduce((acc, f) => acc + SEVERITY_PTS[f.severity], 0));
  const level = score >= 60 ? "HIGH" : score >= 30 ? "MODERATE" : "LOW";

  const summary =
    level === "HIGH"     ? `${flags.length} risk signal(s) detected. Significant due diligence required.`      :
    level === "MODERATE" ? `${flags.length} risk signal(s) present. Monitor over the next 30 days.`           :
                           "Risk profile within acceptable parameters. Creator appears authentic and stable.";

  return { level, score, flags, movingAvgEngagement: Math.round(movingAvgEngagement * 100) / 100, engagementTrend, summary };
}
