// roi-estimation/index.ts — barrel export + master fn
import { ROIEstimationOutput }       from "@/types/global.types";
import { RawMetricsSnapshot }        from "@/types/global.types";
import { estimateImpressions }       from "./impression.estimator";
import { estimateClicks }            from "./click.estimator";
import { estimateConversions }       from "./conversion.estimator";
import { classifyROI }               from "./roi.classifier";
import { buildROIRationale }         from "./roi.rationale";

export { estimateImpressions }  from "./impression.estimator";
export { estimateClicks }       from "./click.estimator";
export { estimateConversions }  from "./conversion.estimator";
export { classifyROI }          from "./roi.classifier";
export { buildROIRationale }    from "./roi.rationale";

export interface ROIInput {
  rawMetrics:          RawMetricsSnapshot;
  niche:               string;
  engagementRate:      number;
  nicheAvgEr:          number;
  purchaseIntentScore: number;
  compositeScore:      number;
  riskScore:           number;
}

export function runROIEstimation(input: ROIInput): ROIEstimationOutput {
  const impressions = estimateImpressions(input.rawMetrics);
  const clicks      = estimateClicks(impressions, input.niche, input.engagementRate, input.nicheAvgEr);
  const conversions = estimateConversions(clicks, input.niche, input.purchaseIntentScore);
  const { band, estimatedReturn, confidence } = classifyROI(input.compositeScore, input.riskScore);
  const rationale   = buildROIRationale(band, estimatedReturn, impressions, clicks, conversions, input.niche);

  return { estimatedImpressions: impressions, estimatedClicks: clicks, estimatedConversions: conversions, band, estimatedReturn, rationale };
}
