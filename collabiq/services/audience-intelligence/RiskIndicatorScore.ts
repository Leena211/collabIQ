import { sentimentScorer } from "./sentimentScorer";
import { authenticityScorer } from "./authenticityScorer";
// engagementScorer will be added later

export function riskIndicatorScore(comment: string): number {
  const sentiment = sentimentScorer(comment);
  const authenticity = authenticityScorer(comment);
  // const engagement = engagementScorer(comment); // placeholder

  // Combine scores (simple average for now)
  const combined = (sentiment + authenticity) / 2;
  return combined;
}
