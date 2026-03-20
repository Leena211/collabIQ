import { evaluateAuthenticity } from "../authenticity.scorer";

describe("Authenticity Scorer", () => {
  it("flags generic repetitive comments", () => {
    const result = evaluateAuthenticity("Nice post");
    expect(result.score).toBeLessThan(1);
    expect(result.signals).toContain("Generic repetitive comment");
  });

  it("flags excessive links", () => {
    const comment = "http://a.com http://b.com http://c.com";
    const result = evaluateAuthenticity(comment);
    expect(result.signals).toContain("Excessive links");
  });

  it("flags too many hashtags", () => {
    const comment = "#fun #cool #wow #test #spam #extra";
    const result = evaluateAuthenticity(comment);
    expect(result.signals).toContain("Too many hashtags");
  });

  it("returns authentic for normal comment", () => {
    const result = evaluateAuthenticity("I really enjoyed this article!");
    expect(result.score).toBe(1);
    expect(result.signals.length).toBe(0);
  });
});
