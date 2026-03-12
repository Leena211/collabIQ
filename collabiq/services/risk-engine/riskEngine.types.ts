export interface RiskInput {
  benchmark: { percentileRank: number; engagementRate: number; growthRate: number };
  audience: { authenticityScore: number; sentimentScore: number };
}

export interface RiskOutput {
  score: number;
  label: string;
  flags: string[];
}
