import { sentimentScorer } from "./sentimentScorer";
import { authenticityScorer } from "./authenticityScorer";
// engagementScorer will be added later

export function riskIndicatorScore(comment: string): number {
  const sentiment = sentimentScorer(comment);
  const authenticity = authenticityScorer(comment);
  // const engagement = engagementScorer(comment); // placeholder

  // Weighted combination: sentiment 40%, authenticity 30%, engagement 30
  const combined = (sentiment * 0.4) + (authenticity * 0.3); // + (engagement * 0.3)
  return combined;
}
