// audience-intelligence/index.ts — barrel export + master fn
import { AudienceIntelligenceOutput } from "@/types/global.types";
import { detectNiche }                from "./nicheDetection.service";
import { estimateInterestClusters }   from "./interestCluster.estimator";
import { scorePurchaseIntent }        from "./purchaseIntent.scorer";
import { scoreEngagementQuality }     from "./engagementQuality.scorer";
import { sentimentScorer } from "./sentimentScorer";
import { authenticityScorer } from "./authenticityScorer";
import { engagementScorer } from "./engagementScorer";
import { riskIndicatorScore } from "./RiskIndicatorScore";

export { detectNiche }              from "./nicheDetection.service";
export { estimateInterestClusters } from "./interestCluster.estimator";
export { scorePurchaseIntent }      from "./purchaseIntent.scorer";
export { scoreEngagementQuality }   from "./engagementQuality.scorer";
export { sentimentScorer } from "./sentimentScorer";
export { authenticityScorer } from "./authenticityScorer";
export { engagementScorer } from "./engagementScorer";
export { riskIndicatorScore } from "./RiskIndicatorScore";


export interface AudienceIntelligenceInput {
  storedNiche:          string | null;
  consistencyScore:     number;
  audienceFitScore:     number;
  engagementRate:       number;
  avgLikes:             number;
  avgComments:          number;
  volatility:           number;
}

export function runAudienceIntelligence(input: AudienceIntelligenceInput): AudienceIntelligenceOutput {
  const { niche, confidence }  = detectNiche(input.storedNiche, input.consistencyScore);
  const interestClusters       = estimateInterestClusters(niche);
  const purchaseIntentScore    = scorePurchaseIntent(niche, input.audienceFitScore, input.engagementRate);
  const engagementQuality      = scoreEngagementQuality(input.audienceFitScore, input.avgLikes, input.avgComments, input.volatility);

  return { detectedNiche: niche, nicheConfidence: confidence, interestClusters, purchaseIntentScore, engagementQuality };
}
