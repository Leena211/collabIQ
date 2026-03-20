import { riskIndicatorScore } from "./RiskIndicatorScore";

describe("Risk Indicator Score", () => {
  it("returns a score between 0 and 100", () => {
    const score = riskIndicatorScore("Great post!", { likes: 10, replies: 2, shares: 1 });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("gives higher score for positive sentiment and high engagement", () => {
    const scorePositive = riskIndicatorScore("Amazing work!", { likes: 50, replies: 10, shares: 5 });
    const scoreNegative = riskIndicatorScore("Terrible idea", { likes: 1, replies: 0, shares: 0 });
    expect(scorePositive).toBeGreaterThan(scoreNegative);
  });

  it("handles neutral comments with moderate engagement", () => {
    const scoreNeutral = riskIndicatorScore("Okay post", { likes: 20, replies: 5, shares: 2 });
    expect(scoreNeutral).toBeGreaterThan(0);
  });
});
