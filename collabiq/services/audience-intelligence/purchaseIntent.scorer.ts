// ============================================================
// purchaseIntent.scorer.ts  — TRD Section 8
// Estimates audience purchase intent based on niche and signals.
//
// Purchase intent is higher in niches with strong product-market fit
// (beauty, fitness, tech) vs entertainment niches (gaming, general).
//
// Score is modulated by:
//   • Niche base intent
//   • Audience quality proxy
//   • Engagement rate (higher ER = more motivated audience)
// ============================================================

const NICHE_INTENT_BASE: Record<string, number> = {
  beauty:    80, finance: 78, fitness: 75, food: 70,
  tech:      72, travel:  65, lifestyle:68, fashion:74,
  gaming:    55, general: 50,
};

export function scorePurchaseIntent(
  niche:               string,
  audienceQualityScore:number,  // 0–100
  engagementRate:      number   // raw %
): number {
  const base       = NICHE_INTENT_BASE[niche.toLowerCase()] ?? 50;
  const qualityMod = (audienceQualityScore / 100) * 15;  // up to +15pts
  const erMod      = Math.min(10, engagementRate * 1.5); // up to +10pts
  return Math.round(Math.min(100, base + qualityMod + erMod));
}
