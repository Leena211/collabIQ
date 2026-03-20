// commentSentiment.scorer.ts
export function scoreCommentSentiment(comment: string): number {
  // Simple sentiment scoring: +1 for positive words, -1 for negative words
  const positiveWords = ["good", "great", "excellent", "love", "amazing"];
  const negativeWords = ["bad", "poor", "hate", "terrible", "awful"];

  let score = 0;

  for (const word of positiveWords) {
    if (comment.toLowerCase().includes(word)) {
      score += 1;
    }
  }

  for (const word of negativeWords) {
    if (comment.toLowerCase().includes(word)) {
      score -= 1;
    }
  }

  return score;
}
