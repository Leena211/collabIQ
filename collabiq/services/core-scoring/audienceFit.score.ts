// ============================================================
// audienceFit.score.ts  — TRD Section 6
// Proxy score for audience quality and platform fit.
//
// Three components (max contribution in parentheses):
//   ① ER signal:        ER × 4, capped at 40pts
//   ② FF ratio:         (followers / following) × 3, capped at 30pts
//   ③ View/sub ratio:   (avgViews / subscribers) × 100, capped at 30pts
// ============================================================

import { RawMetricsSnapshot, AudienceFitScoreOutput } from "@/types/global.types";

export function calcAudienceFitScore(m: RawMetricsSnapshot): AudienceFitScoreOutput {
  const er      = m.followers > 0
    ? ((m.avgLikes + m.avgComments + m.avgShares) / m.followers) * 100
    : 0;

  // ① ER component
  const erPts = Math.min(40, er * 4);

  // ② Follower:following ratio
  const ffRatio = m.following > 0 ? m.followers / m.following : (m.followers > 0 ? 10 : 0);
  const ffPts   = Math.min(30, ffRatio * 3);

  // ③ View ratio (YouTube: views/subs; Instagram: views/followers)
  const base      = m.subscribers ?? m.followers;
  const viewRatio = base > 0 && m.avgViews > 0 ? m.avgViews / base : 0;
  const viewPts   = Math.min(30, viewRatio * 100);

  const score = Math.round(Math.min(100, erPts + ffPts + viewPts));

  return {
    score,
    qualityProxy: score,
    ffRatio:      Math.round(ffRatio * 100) / 100,
    viewRatio:    Math.round(viewRatio * 1000) / 1000,
  };
}
