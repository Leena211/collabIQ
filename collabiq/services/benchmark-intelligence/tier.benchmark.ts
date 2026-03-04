// ============================================================
// tier.benchmark.ts  — TRD Section 7
// Classifies creator into influencer tier based on follower count.
// Tier affects expected ER ranges and benchmark interpretation.
//
// Tiers (followers):
//   MEGA  : ≥ 1M
//   MACRO : ≥ 100K
//   MID   : ≥ 50K
//   MICRO : ≥ 10K
//   NANO  : < 10K
//
// Tier-adjusted ER expectations:
//   MEGA=1.5%, MACRO=2.5%, MID=3.5%, MICRO=5.0%, NANO=7.0%
// ============================================================

import { NicheTier } from "@/types/global.types";

export interface TierProfile {
  tier:        NicheTier;
  minFollowers:number;
  maxFollowers:number;
  expectedER:  number; // benchmark ER for this tier
}

export const TIER_PROFILES: TierProfile[] = [
  { tier: "MEGA",  minFollowers: 1_000_000, maxFollowers: Infinity,   expectedER: 1.5 },
  { tier: "MACRO", minFollowers:   100_000, maxFollowers:   999_999,  expectedER: 2.5 },
  { tier: "MID",   minFollowers:    50_000, maxFollowers:    99_999,  expectedER: 3.5 },
  { tier: "MICRO", minFollowers:    10_000, maxFollowers:    49_999,  expectedER: 5.0 },
  { tier: "NANO",  minFollowers:         0, maxFollowers:     9_999,  expectedER: 7.0 },
];

export function classifyTier(followers: number): NicheTier {
  return (
    TIER_PROFILES.find((t) => followers >= t.minFollowers && followers <= t.maxFollowers)?.tier
    ?? "NANO"
  );
}

export function getTierProfile(tier: NicheTier): TierProfile {
  return TIER_PROFILES.find((t) => t.tier === tier) ?? TIER_PROFILES[TIER_PROFILES.length - 1];
}
