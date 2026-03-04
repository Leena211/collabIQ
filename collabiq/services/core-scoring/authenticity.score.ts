// ============================================================
// authenticity.score.ts  — TRD Section 6
// Detects inauthentic signals and produces an authenticity score.
//
// AuthenticityScore = 100 - (fakeBotRisk × 100)
//
// fakeBotRisk composite heuristics:
//   +0.30 — Low ER on large account (≥10k followers, ER < 0.5%)
//   +0.25 — following > 2× followers
//   +0.20 — high engagement volatility (σ > 50)
//   +0.25 — suspicious spike detected (latest > μ + 2.5σ)
// ============================================================

import { RawMetricsSnapshot, AuthenticityScoreOutput } from "@/types/global.types";

const SPIKE_MULTIPLIER    = 2.5;
const BOT_MIN_FOLLOWERS   = 10_000;
const SUSPICIOUS_LOW_ER   = 0.5;

function stdDev(vals: number[]): number {
  if (vals.length < 2) return 0;
  const m = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.sqrt(vals.map((v) => (v - m) ** 2).reduce((a, b) => a + b, 0) / vals.length);
}

export function calcAuthenticityScore(
  m:         RawMetricsSnapshot,
  erHistory: number[]
): AuthenticityScoreOutput {
  const er = m.followers > 0
    ? ((m.avgLikes + m.avgComments + m.avgShares) / m.followers) * 100
    : 0;

  let fakeBotRisk = 0;

  // Low ER on large account
  if (er < SUSPICIOUS_LOW_ER && m.followers > BOT_MIN_FOLLOWERS) fakeBotRisk += 0.30;

  // Following >> followers
  if (m.following > 0 && m.following / m.followers > 2) fakeBotRisk += 0.25;

  // High volatility
  const σ = stdDev(erHistory);
  if (σ > 50) fakeBotRisk += 0.20;

  // Suspicious spike
  let suspiciousSpike = false;
  if (erHistory.length >= 3) {
    const μ      = erHistory.reduce((a, b) => a + b, 0) / erHistory.length;
    const latest = erHistory[erHistory.length - 1];
    suspiciousSpike = latest > μ + SPIKE_MULTIPLIER * σ;
    if (suspiciousSpike) fakeBotRisk += 0.25;
  }

  fakeBotRisk = Math.min(1, fakeBotRisk);
  const score = Math.round(Math.max(0, 100 - fakeBotRisk * 100));

  return { score, fakeBotRisk, suspiciousSpike };
}
