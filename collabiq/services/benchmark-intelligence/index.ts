// benchmark-intelligence/index.ts — barrel export + master benchmark fn
import { BenchmarkOutput } from "@/types/global.types";
import { resolveNiche, NICHE_BENCHMARKS, compareToNiche } from "./niche.benchmark";
import { classifyTier, getTierProfile }                   from "./tier.benchmark";
import { adjustBenchmarkForPlatform }                     from "./platform.benchmark";
import type { Platform } from "@/types/global.types";

// Supporting modules
import { validateBenchmark } from "./validation";
import { authMiddleware }    from "./auth.middleware";
import { logInfo, logError, logBenchmarkRun } from "./logger";
import type { BenchmarkInput } from "./types";

// Barrel exports
export { resolveNiche, NICHE_BENCHMARKS } from "./niche.benchmark";
export { classifyTier, getTierProfile }   from "./tier.benchmark";
export { adjustBenchmarkForPlatform }     from "./platform.benchmark";
export { validateBenchmark }              from "./validation";
export { authMiddleware }                 from "./auth.middleware";
export { logInfo, logError, logBenchmarkRun } from "./logger";
export type { BenchmarkInput }            from "./types";

export function runBenchmark(input: BenchmarkInput): BenchmarkOutput {
  // Validate input before processing
  const check = validateBenchmark(input);
  if (!check.valid) {
    logError("Invalid benchmark input", check.error);
    throw new Error(check.error);
  }

  logInfo("Benchmark run started");

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

  const result: BenchmarkOutput = {
    niche:          nicheKey,
    tier,
    platform:       input.platform,
    percentileRank,
    zScore:         Math.round(compositeZ * 100) / 100,
    nicheAvgEr:     adjustBenchmarkForPlatform(bench.engagementRate.mean, input.platform),
    nicheAvgGrowth: bench.growthRate.mean,
    comparison,
  };

  logBenchmarkRun(input, result);
  logInfo("Benchmark run completed successfully");

  return result;
}
