// ============================================================
// riskFlags.detector.ts  — TRD Section 6 (Risk separated)
// Individual risk flag detectors.
// Each function returns RiskFlag | null — null means clean.
//
// Thresholds:
//   Fake/bot:       moderate ≥0.30, high ≥0.60
//   Volatility:     moderate ≥30σ,  high ≥60σ
//   Engagement drop:moderate ≤-20%, high ≤-40% vs moving avg
//   Growth spike:   >50% growth in single period
// ============================================================

import { RiskFlag } from "@/types/global.types";

export function flagFakeBotRisk(fakeBotRisk: number): RiskFlag | null {
  if (fakeBotRisk >= 0.60) return { code: "FAKE_BOT_HIGH",     severity: "HIGH",     description: `Fake/bot risk ${(fakeBotRisk*100).toFixed(1)}% — exceeds high threshold (60%).` };
  if (fakeBotRisk >= 0.30) return { code: "FAKE_BOT_MODERATE", severity: "MODERATE", description: `Fake/bot risk ${(fakeBotRisk*100).toFixed(1)}% — elevated inauthentic activity.` };
  return null;
}

export function flagVolatility(volatility: number): RiskFlag | null {
  if (volatility >= 60) return { code: "HIGH_VOLATILITY",     severity: "HIGH",     description: `Engagement σ=${volatility.toFixed(1)} — highly unpredictable performance.`     };
  if (volatility >= 30) return { code: "MODERATE_VOLATILITY", severity: "MODERATE", description: `Engagement σ=${volatility.toFixed(1)} — inconsistent results over time.`         };
  return null;
}

export function flagSuspiciousSpike(spike: boolean): RiskFlag | null {
  if (!spike) return null;
  return { code: "ENGAGEMENT_SPIKE", severity: "HIGH", description: "Latest engagement exceeds 2.5σ above historical mean. Possible inauthentic activity or isolated viral event." };
}

export function flagEngagementDrop(currentER: number, movingAvgER: number): RiskFlag | null {
  if (movingAvgER === 0) return null;
  const drop = ((currentER - movingAvgER) / movingAvgER) * 100;
  if (drop <= -40) return { code: "ENGAGEMENT_DROP_HIGH",     severity: "HIGH",     description: `ER is ${Math.abs(drop).toFixed(1)}% below moving average — significant audience decline.` };
  if (drop <= -20) return { code: "ENGAGEMENT_DROP_MODERATE", severity: "MODERATE", description: `ER is ${Math.abs(drop).toFixed(1)}% below moving average — monitor closely.`              };
  return null;
}

export function flagGrowthAnomaly(growthRate: number): RiskFlag | null {
  if (growthRate > 50) return { code: "GROWTH_SPIKE", severity: "MODERATE", description: `Growth rate of ${growthRate.toFixed(1)}% is abnormally high — may indicate purchased followers.` };
  return null;
}
