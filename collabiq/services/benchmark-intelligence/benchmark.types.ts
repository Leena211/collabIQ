// Shared types for Benchmark Intelligence

export interface BenchmarkResult {
  tier: string;
  engagementDelta: number;
  engagementPercentile: string;
  nicheGrowthDelta: number | null;
  nicheConsistencyDelta: number | null;
  platformContext: string;
}
