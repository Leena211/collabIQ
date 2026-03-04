// ============================================================
// platform.benchmark.ts  — TRD Section 7
// Platform-specific benchmark adjustments.
//
// Instagram tends to have higher ER than YouTube due to
// algorithmic amplification of visual content.
// YouTube views-per-subscriber are a stronger engagement signal.
// ============================================================

import { Platform } from "@/types/global.types";

export interface PlatformAdjustment {
  erMultiplier:      number; // adjust niche ER benchmark for this platform
  primarySignal:     string; // what metric matters most on this platform
  engagementFormula: string; // description of how ER is computed
}

export const PLATFORM_ADJUSTMENTS: Record<Platform, PlatformAdjustment> = {
  INSTAGRAM: {
    erMultiplier:      1.2,  // Instagram ER runs ~20% higher than YouTube
    primarySignal:     "likes + comments + shares / followers",
    engagementFormula: "(avgLikes + avgComments + avgShares) / followers × 100",
  },
  YOUTUBE: {
    erMultiplier:      0.8,  // YouTube ER is lower by convention
    primarySignal:     "views per subscriber + likes / views",
    engagementFormula: "(avgLikes + avgComments) / subscribers × 100",
  },
};

export function adjustBenchmarkForPlatform(nicheMeanER: number, platform: Platform): number {
  return Math.round(nicheMeanER * PLATFORM_ADJUSTMENTS[platform].erMultiplier * 100) / 100;
}
