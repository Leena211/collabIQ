// Utility functions for Benchmark Intelligence

// Normalize a value between 0–1
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

// Calculate percentile rank given a delta vs median
export function percentileRank(delta: number): string {
  if (delta > 0.05) return "Top Quartile";
  if (delta > 0) return "Above Median";
  if (delta === 0) return "Median";
  if (delta > -0.05) return "Below Median";
  return "Bottom Quartile";
}
