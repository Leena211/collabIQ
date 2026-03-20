import { runBenchmarkAnalysis } from "./benchmark.engine";

describe("Benchmark Intelligence Engine", () => {
  it("classifies tier correctly", () => {
    const result = runBenchmarkAnalysis({
      follower_count: 12000,
      niche: "fitness",
      platform: "instagram",
      engagement_rate: 0.045,
      growth_score: 0.03,
      consistency_score: 0.7,
    });
    expect(result.tier).toBe("Micro");
    expect(result.engagementPercentile).toBe("Above Median");
  });
});
