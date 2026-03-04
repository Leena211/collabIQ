// ============================================================
// nicheDetection.service.ts  — TRD Section 8
// Detects the creator's content niche from available signals.
//
// In production: use content category tags from platform API,
// or pass through a classifier. Here we use the stored niche
// field with a confidence proxy based on posting consistency.
//
// Returns detectedNiche + confidence (0–1).
// ============================================================

export interface NicheDetectionResult {
  niche:      string;
  confidence: number; // 0–1
}

// Niche taxonomy — extend as needed
const KNOWN_NICHES = ["fitness","tech","beauty","gaming","finance","lifestyle","food","travel","fashion","education"];

export function detectNiche(
  storedNiche:      string | null,
  consistencyScore: number        // 0–100: higher = more topically focused
): NicheDetectionResult {
  const niche      = storedNiche?.toLowerCase().trim() ?? "general";
  const isKnown    = KNOWN_NICHES.includes(niche);
  // Confidence: known niche × posting consistency proxy
  const confidence = isKnown ? Math.min(1, 0.60 + (consistencyScore / 100) * 0.40) : 0.40;
  return { niche: isKnown ? niche : "general", confidence: Math.round(confidence * 100) / 100 };
}
