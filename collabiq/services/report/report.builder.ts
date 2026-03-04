// ============================================================
// report.builder.ts  — TRD Section 11
// Assembles the final InvestmentReport JSON from all layer
// outputs. Does NOT perform any calculations itself.
//
// This is the single object returned by GET /api/report/:id
// and persisted to the Report table.
// ============================================================

import { InvestmentReport, NarrationOutput } from "@/types/global.types";
import type {
  RawMetricsSnapshot,
  CompositeScoreOutput,
  CSSOutput,
  GSIOutput,
  ROIBandOutput,
  RiskAnalysisOutput,
  BenchmarkOutput,
  AudienceIntelligenceOutput,
  ROIEstimationOutput,
  Platform,
} from "@/types/global.types";

export interface ReportAssemblyInput {
  creatorId:            string;
  creatorHandle:        string;
  platform:             Platform;
  niche:                string;
  rawMetrics:           RawMetricsSnapshot;
  scores:               CompositeScoreOutput;
  css:                  CSSOutput;
  gsi:                  GSIOutput;
  roiBand:              ROIBandOutput;
  riskAnalysis:         RiskAnalysisOutput;
  benchmark:            BenchmarkOutput;
  audienceIntelligence: AudienceIntelligenceOutput;
  roiEstimation:        ROIEstimationOutput;
  aiReport:             NarrationOutput;
}

export function buildReport(input: ReportAssemblyInput): InvestmentReport {
  return {
    creatorId:     input.creatorId,
    creatorHandle: input.creatorHandle,
    platform:      input.platform,
    niche:         input.niche,
    generatedAt:   new Date().toISOString(),
    rawMetrics:    input.rawMetrics,
    scores:        input.scores,
    derivedMetrics: {
      css:     input.css,
      gsi:     input.gsi,
      roiBand: input.roiBand,
    },
    riskAnalysis:         input.riskAnalysis,
    benchmark:            input.benchmark,
    audienceIntelligence: input.audienceIntelligence,
    roiEstimation:        input.roiEstimation,
    aiReport:             input.aiReport,
  };
}
