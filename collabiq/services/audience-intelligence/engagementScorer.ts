export function engagementScorer(metrics: { likes: number; replies: number; shares: number }): number {
  const { likes, replies, shares } = metrics;

  // Simple weighted formula: likes 40%, replies 30%, shares 30
  const score = (likes * 0.4) + (replies * 0.3) + (shares * 0.3);

  // Normalize to a 0–100 scale
  return Math.min(score, 100);
}
