// ============================================================
// interestCluster.estimator.ts  — TRD Section 8
// Estimates adjacent interest clusters from detected niche.
//
// In production: pull from platform topic affinity API or
// run an embedding-based topic model over recent post captions.
// Here we use a static adjacency map.
// ============================================================

const NICHE_CLUSTERS: Record<string, string[]> = {
  fitness:   ["nutrition", "wellness", "sports", "supplements", "mental health"],
  tech:      ["gadgets", "software", "AI", "productivity", "gaming"],
  beauty:    ["skincare", "makeup", "fashion", "wellness", "self-care"],
  gaming:    ["tech", "esports", "streaming", "anime", "entertainment"],
  finance:   ["investing", "crypto", "real estate", "entrepreneurship", "productivity"],
  lifestyle: ["travel", "wellness", "food", "fashion", "home decor"],
  food:      ["nutrition", "travel", "lifestyle", "cooking", "wellness"],
  travel:    ["lifestyle", "photography", "food", "culture", "adventure"],
  general:   ["lifestyle", "entertainment", "wellness"],
};

export function estimateInterestClusters(niche: string): string[] {
  return NICHE_CLUSTERS[niche.toLowerCase()] ?? NICHE_CLUSTERS["general"];
}
