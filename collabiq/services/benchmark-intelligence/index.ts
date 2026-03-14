// benchmark-intelligence/index.ts — barrel export + master benchmark fn
import { BenchmarkOutput } from "@/types/global.types";
import { resolveNiche, NICHE_BENCHMARKS, compareToNiche } from "./niche.benchmark";
import { classifyTier }                                    from "./tier.benchmark";
import { adjustBenchmarkForPlatform }                     from "./platform.benchmark";
import type { Platform } from "@/types/global.types";

export { resolveNiche, NICHE_BENCHMARKS } from "./niche.benchmark";
export { classifyTier, getTierProfile }   from "./tier.benchmark";
export { adjustBenchmarkForPlatform }     from "./platform.benchmark";
export * from "./benchmark.utils";
export * from "./benchmark.types";
export * from "./benchmark.engine";

export interface BenchmarkInput {
  engagementRate:       number;
  growthRate:           number;
  consistencyScore:     number;
  audienceQualityScore: number;
  postingFrequency:     number;
  followers:            number;
  niche:                string;
  platform:             Platform;
}

export function runBenchmark(input: BenchmarkInput): BenchmarkOutput {
  const nicheKey = resolveNiche(input.niche);
  const bench    = NICHE_BENCHMARKS[nicheKey];
  const tier     = classifyTier(input.followers);

  const comparison = {
    engagementRate:       compareToNiche(input.engagementRate,       bench.engagementRate),
    growthRate:           compareToNiche(input.growthRate,           bench.growthRate),
    consistencyScore:     compareToNiche(input.consistencyScore,     bench.consistency),
    audienceQualityScore: compareToNiche(input.audienceQualityScore, bench.audienceQuality),
    postingFrequency:     compareToNiche(input.postingFrequency,     bench.postingFrequency),
  };

  const erZ      = bench.engagementRate.stdDev > 0 ? (input.engagementRate - bench.engagementRate.mean) / bench.engagementRate.stdDev : 0;
  const growthZ  = bench.growthRate.stdDev > 0     ? (input.growthRate     - bench.growthRate.mean)     / bench.growthRate.stdDev     : 0;
  const compositeZ = (erZ + growthZ) / 2;

  // Simplified percentile from composite z
  const percentileRank = comparison.engagementRate.percentile;

  return {
    niche:          nicheKey,
    tier,
    platform:       input.platform,
    percentileRank,
    zScore:         Math.round(compositeZ * 100) / 100,
    nicheAvgEr:     adjustBenchmarkForPlatform(bench.engagementRate.mean, input.platform),
    nicheAvgGrowth: bench.growthRate.mean,
    comparison,
  };
}
