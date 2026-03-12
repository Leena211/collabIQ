// services/audience-intelligence/authenticity.scorer.ts

export interface AuthenticityResult {
  score: number; // 0 = suspicious, 1 = authentic
  signals: string[];
}

export function evaluateAuthenticity(comment: string): AuthenticityResult {
  const signals: string[] = [];
  let score = 1; // start assuming authentic

  // Rule 1: Generic repetitive comments
  if (/^(nice post|great job)$/i.test(comment.trim())) {
    signals.push("Generic repetitive comment");
    score -= 0.3;
  }

  // Rule 2: Too many links
  const linkCount = (comment.match(/https?:\/\//g) || []).length;
  if (linkCount > 2) {
    signals.push("Excessive links");
    score -= 0.4;
  }

  // Rule 3: Overuse of hashtags
  const hashtagCount = (comment.match(/#/g) || []).length;
  if (hashtagCount > 5) {
    signals.push("Too many hashtags");
    score -= 0.2;
  }

  // Clamp score between 0 and 1
  score = Math.max(0, Math.min(1, score));

  return { score, signals };
}
