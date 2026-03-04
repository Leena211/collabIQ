// ============================================================
// engagementQuality.scorer.ts  — TRD Section 8
// Measures depth of audience engagement vs surface-level metrics.
//
// Comment-to-like ratio is a depth signal:
//   high comments relative to likes = active, invested audience
//
// Formula:
//   commentRatio = avgComments / avgLikes
//   qualityScore = base(audienceFitScore)
//               + commentBonus(commentRatio × 10, max 20pts)
//               - volatilityPenalty(volatility × 0.3, max 30pts)
// ============================================================

export function scoreEngagementQuality(
  audienceFitScore: number, // 0–100
  avgLikes:         number,
  avgComments:      number,
  volatility:       number
): number {
  const commentRatio  = avgLikes > 0 ? avgComments / avgLikes : 0;
  const commentBonus  = Math.min(20, commentRatio * 10 * 20); // commentRatio 0.1 → +2pts
  const volatilityPen = Math.min(30, volatility * 0.3);
  return Math.round(Math.min(100, Math.max(0, audienceFitScore + commentBonus - volatilityPen)));
}
