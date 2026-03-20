import { classifyTier, tierBenchmarks } from "./tier.benchmark";
import { benchmarkVsNiche } from "./niche.benchmark";
import { benchmarkEngagement } from "./platform.benchmark";
import { percentileRank } from "./benchmark.utils";
import { BenchmarkResult } from "./benchmark.types";

export function runBenchmarkAnalysis(profile: {
  follower_count: number;
  niche: string;
  platform: "instagram" | "linkedin";
  engagement_rate: number;
  growth_score: number;
  consistency_score: number;
}): BenchmarkResult {
  const tier = classifyTier(profile.follower_count);
  const tierMedian = tierBenchmarks[tier].medianEngagement;
  const engagementDelta = profile.engagement_rate - tierMedian;

  const nicheComparison = benchmarkVsNiche(
    profile.niche,
    profile.growth_score,
    profile.consistency_score
  );

  const platformComparison = benchmarkEngagement(
    profile.platform,
    profile.engagement_rate
  );

  return {
    tier,
    engagementDelta,
    engagementPercentile: percentileRank(engagementDelta),
    nicheGrowthDelta: nicheComparison.growthDelta,
    nicheConsistencyDelta: nicheComparison.consistencyDelta,
    platformContext: platformComparison.percentileContext,
  };
}
