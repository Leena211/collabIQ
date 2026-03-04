// ============================================================
// composite.score.ts  — TRD Section 6
// Combines all sub-scores into a single 0–100 investment score.
//
// Weight distribution:
//   Engagement    30%
//   Authenticity  25%   ← trust signal, high weight
//   Audience Fit  20%
//   Growth        15%
//   Consistency   10%
//
// ROI Potential:  engagement (35%) + growth (30%) + fit (20%) + consistency (15%)
// Risk Score:     100 - authenticity, weighted by volatility and spike
// Composite:      investment×0.40 + roi×0.35 - risk×0.25
// ============================================================

import {
  EngagementScoreOutput,
  GrowthScoreOutput,
  ConsistencyScoreOutput,
  AuthenticityScoreOutput,
  AudienceFitScoreOutput,
  CompositeScoreOutput,
} from "@/types/global.types";

const W_INVESTMENT = { engagement: 0.30, authenticity: 0.25, audienceFit: 0.20, growth: 0.15, consistency: 0.10 };
const W_ROI        = { engagement: 0.35, growth: 0.30, audienceFit: 0.20, consistency: 0.15 };
const W_COMPOSITE  = { investment: 0.40, roi: 0.35, riskPenalty: 0.25 };

function clamp(v: number) { return Math.round(Math.min(100, Math.max(0, v))); }

export function calcCompositeScore(
  eng:  EngagementScoreOutput,
  grow: GrowthScoreOutput,
  con:  ConsistencyScoreOutput,
  auth: AuthenticityScoreOutput,
  fit:  AudienceFitScoreOutput,
): CompositeScoreOutput {
  const investmentScore = clamp(
    W_INVESTMENT.engagement    * eng.normalised   +
    W_INVESTMENT.authenticity  * auth.score       +
    W_INVESTMENT.audienceFit   * fit.score        +
    W_INVESTMENT.growth        * grow.normalised  +
    W_INVESTMENT.consistency   * con.score
  );

  const roiPotential = clamp(
    W_ROI.engagement    * eng.normalised  +
    W_ROI.growth        * grow.normalised +
    W_ROI.audienceFit   * fit.score       +
    W_ROI.consistency   * con.score
  );

  // Risk score: inverse of authenticity + volatility penalty
  const volatilityRisk = Math.min(100, con.volatility);
  const spikeRisk      = auth.suspiciousSpike ? 20 : 0;
  const riskScore      = clamp((100 - auth.score) * 0.60 + volatilityRisk * 0.25 + spikeRisk * 0.15);

  const compositeScore = clamp(
    W_COMPOSITE.investment  * investmentScore +
    W_COMPOSITE.roi         * roiPotential    -
    W_COMPOSITE.riskPenalty * riskScore
  );

  return {
    investmentScore,
    roiPotential,
    riskScore,
    compositeScore,
    breakdown: {
      engagement:   eng.normalised,
      growth:       grow.normalised,
      consistency:  con.score,
      authenticity: auth.score,
      audienceFit:  fit.score,
    },
  };
}
