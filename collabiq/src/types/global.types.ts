// ============================================================
// global.types.ts
// Shared type contracts used across all service layers.
// Import from here — never duplicate types across services.
// ============================================================

// ── Enums ────────────────────────────────────────────────────

export type Platform  = "INSTAGRAM" | "YOUTUBE";
export type RiskLevel = "LOW" | "MODERATE" | "HIGH";
export type ROIBand   = "VERY_HIGH" | "HIGH" | "MEDIUM" | "LOW" | "VERY_LOW";
export type NicheTier = "MEGA" | "MACRO" | "MID" | "MICRO" | "NANO";

// ── Raw Metrics ───────────────────────────────────────────────
// Direct snapshot from platform API ingestion

export interface RawMetricsSnapshot {
  creatorId:      string;
  platform:       Platform;
  snapshotAt:     Date;
  followers:      number;
  following:      number;
  totalPosts:     number;
  avgLikes:       number;
  avgComments:    number;
  avgShares:      number;
  avgViews:       number;
  // Instagram-specific
  reachRate?:     number;
  impressionRate?:number;
  storyViews?:    number;
  // YouTube-specific
  subscribers?:   number;
  avgWatchTime?:  number; // seconds
  avgRetention?:  number; // %
  totalVideos?:   number;
}

// ── Core Score Outputs ────────────────────────────────────────

export interface EngagementScoreOutput {
  raw:        number; // actual ER %
  normalised: number; // 0–100
}

export interface GrowthScoreOutput {
  rawRate:    number; // % change
  normalised: number; // 0–100
  trend:      "RISING" | "FALLING" | "STABLE";
}

export interface ConsistencyScoreOutput {
  score:            number; // 0–100
  postingFrequency: number; // posts/week
  volatility:       number; // σ of engagement
}

export interface AuthenticityScoreOutput {
  score:           number;  // 0–100 (higher = more authentic)
  fakeBotRisk:     number;  // 0–1
  suspiciousSpike: boolean;
}

export interface AudienceFitScoreOutput {
  score:          number; // 0–100
  qualityProxy:   number; // 0–100 audience quality
  ffRatio:        number; // follower:following ratio
  viewRatio:      number; // views per follower/subscriber
}

export interface CompositeScoreOutput {
  investmentScore: number; // 0–100 final weighted score
  roiPotential:    number; // 0–100
  riskScore:       number; // 0–100
  compositeScore:  number; // 0–100
  breakdown: {
    engagement:   number;
    growth:       number;
    consistency:  number;
    authenticity: number;
    audienceFit:  number;
  };
}

// ── Derived Metrics ───────────────────────────────────────────

export interface CSSOutput {
  score:       number; // 0–100 Collaboration Stability Score
  label:       "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
  explanation: string;
}

export interface GSIOutput {
  score:            number; // 0–100 Growth Sustainability Index
  sustainableGrowth:boolean;
  explanation:      string;
}

export interface ROIBandOutput {
  band:            ROIBand;
  estimatedReturn: string; // e.g. "3x–5x"
  confidence:      "HIGH" | "MEDIUM" | "LOW";
}

// ── Risk ──────────────────────────────────────────────────────

export interface RiskFlag {
  code:        string;
  severity:    RiskLevel;
  description: string;
}

export interface RiskAnalysisOutput {
  level:               RiskLevel;
  score:               number;    // 0–100
  flags:               RiskFlag[];
  movingAvgEngagement: number;
  engagementTrend:     "RISING" | "FALLING" | "STABLE";
  summary:             string;
}

// ── Benchmark ─────────────────────────────────────────────────

export interface MetricComparison {
  creatorValue:   number;
  benchmarkMean:  number;
  benchmarkMedian:number;
  percentile:     number; // 0–100
  isAboveAverage: boolean;
}

export interface BenchmarkOutput {
  niche:          string;
  tier:           NicheTier;
  platform:       Platform;
  percentileRank: number;
  zScore:         number;
  nicheAvgEr:     number;
  nicheAvgGrowth: number;
  comparison: {
    engagementRate:       MetricComparison;
    growthRate:           MetricComparison;
    consistencyScore:     MetricComparison;
    audienceQualityScore: MetricComparison;
    postingFrequency:     MetricComparison;
  };
}

// ── Audience Intelligence ─────────────────────────────────────

export interface AudienceIntelligenceOutput {
  detectedNiche:       string;
  nicheConfidence:     number;   // 0–1
  interestClusters:    string[]; // e.g. ["fitness", "nutrition", "wellness"]
  purchaseIntentScore: number;   // 0–100
  engagementQuality:   number;   // 0–100
}

// ── ROI Estimation ────────────────────────────────────────────

export interface ROIEstimationOutput {
  estimatedImpressions: number;
  estimatedClicks:      number;
  estimatedConversions: number;
  band:                 ROIBand;
  estimatedReturn:      string;
  rationale:            string;
}

// ── AI Narration ──────────────────────────────────────────────

export interface NarrationOutput {
  executiveSummary:        string;
  performanceAnalysis:     string;
  riskExplanation:         string;
  roiJustification:        string;
  strategicRecommendation: string;
}

// ── Final Investment Report ───────────────────────────────────

export interface InvestmentReport {
  creatorId:          string;
  creatorHandle:      string;
  platform:           Platform;
  niche:              string;
  generatedAt:        string;
  rawMetrics:         RawMetricsSnapshot;
  scores:             CompositeScoreOutput;
  derivedMetrics: {
    css:     CSSOutput;
    gsi:     GSIOutput;
    roiBand: ROIBandOutput;
  };
  riskAnalysis:       RiskAnalysisOutput;
  benchmark:          BenchmarkOutput;
  audienceIntelligence:AudienceIntelligenceOutput;
  roiEstimation:      ROIEstimationOutput;
  aiReport:           NarrationOutput;
}
