// ============================================================
// click.estimator.ts  — TRD Section 9
// Estimates clicks from impressions using CTR model.
//
// CTR ranges by niche (industry benchmarks):
//   High-intent niches (beauty, fitness):  1.5%–2.5%
//   Mid-intent (tech, finance):            0.8%–1.5%
//   Lower-intent (gaming, general):        0.3%–0.8%
//
// Adjusted by engagementRate: ER > niche avg → +20% CTR
// ============================================================

const NICHE_CTR: Record<string, number> = {
  beauty: 0.020, fitness: 0.018, food: 0.016, fashion: 0.017,
  tech:   0.012, finance: 0.013, lifestyle: 0.014,
  gaming: 0.006, general: 0.008,
};
const DEFAULT_CTR = 0.010;

export function estimateClicks(
  impressions:    number,
  niche:          string,
  engagementRate: number,  // raw %
  nicheAvgEr:     number   // benchmark niche avg ER
): number {
  const baseCTR   = NICHE_CTR[niche.toLowerCase()] ?? DEFAULT_CTR;
  const erBoost   = engagementRate > nicheAvgEr ? 1.20 : 1.00;
  return Math.round(impressions * baseCTR * erBoost);
}
