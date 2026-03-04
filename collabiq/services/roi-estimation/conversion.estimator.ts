// ============================================================
// conversion.estimator.ts  — TRD Section 9
// Estimates conversions from clicks using CVR model.
//
// CVR ranges by niche (purchase intent proxy):
//   High:   beauty (3%), fitness (2.5%), finance (2%)
//   Medium: tech (1.5%), food (1.8%), lifestyle (1.5%)
//   Lower:  gaming (0.8%), general (1%)
//
// Adjusted by purchaseIntentScore: every 10pts above 60 = +0.2% CVR
// ============================================================

const NICHE_CVR: Record<string, number> = {
  beauty: 0.030, finance: 0.025, fitness: 0.025, food: 0.018,
  tech:   0.015, lifestyle: 0.015, fashion: 0.020,
  gaming: 0.008, general: 0.010,
};
const DEFAULT_CVR = 0.012;

export function estimateConversions(
  clicks:              number,
  niche:               string,
  purchaseIntentScore: number // 0–100
): number {
  const baseCVR  = NICHE_CVR[niche.toLowerCase()] ?? DEFAULT_CVR;
  const intentBoost = Math.max(0, (purchaseIntentScore - 60) / 10) * 0.002;
  return Math.round(clicks * (baseCVR + intentBoost));
}
