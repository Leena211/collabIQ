// ============================================================
// analysis.pipeline.ts  — Pipeline Coordinator
//
// This is the single entry point that wires all service layers
// together in the correct sequence. Route handlers call this.
//
// Pipeline sequence:
//   1.  Load raw metrics snapshots from DB            (Layer 8/9)
//   2.  Core scoring sub-scores                       (Layer 4/5)
//   3.  Composite score                               (Layer 5)
//   4.  Derived metrics: CSS, GSI, ROI Band           (Layer 5)
//   5.  Risk analysis                                 (Layer 6)
//   6.  Benchmark intelligence                        (Layer 5)
//   7.  Audience intelligence                         (Layer 8)
//   8.  ROI estimation                                (Layer 9)
//   9.  Assemble report shell (no AI yet)             (Layer 11)
//   10. AI narration — last step, receives full report(Layer 7)
//   11. Persist report to DB                          (Layer 8)
//   12. Return final InvestmentReport                 (Layer 2)
// ============================================================

import { prisma }                       from "@/lib/prisma";
import { InvestmentReport, Platform }   from "@/types/global.types";

// Core scoring
import {
  calcEngagementScore,
  calcGrowthScore,
  calcConsistencyScore,
  calcAuthenticityScore,
  calcAudienceFitScore,
  calcCompositeScore,
} from "../core-scoring";

// Derived metrics
import { calcCSS, calcGSI, calcROIBand } from "../derived-metrics";

// Risk engine
import { calcRiskAnalysis } from "../risk-engine";

// Benchmark
import { runBenchmark }     from "../benchmark-intelligence";

// Audience intelligence
import { runAudienceIntelligence } from "../audience-intelligence";

// ROI estimation
import { runROIEstimation } from "../roi-estimation";

// Report builder
import { buildReport }      from "../report";

// Narration — called LAST
import { generateNarration } from "../narration";

import type { RiskLevel } from "@prisma/client";

// ── Pipeline entry point ──────────────────────────────────────

export async function runAnalysisPipeline(creatorId: string): Promise<InvestmentReport> {
  // ── 1. Load creator + last 10 snapshots ──────────────────
  const creator = await prisma.creator.findUnique({
    where:   { id: creatorId },
    include: { rawMetrics: { orderBy: { snapshotAt: "desc" }, take: 10 } },
  });

  if (!creator || !creator.rawMetrics.length) {
    throw new Error(`Creator ${creatorId} not found or has no metrics. Run ingestion first.`);
  }

  const latest   = creator.rawMetrics[0];
  const previous = creator.rawMetrics[1] ?? latest;
  const platform = latest.platform as Platform;
  const niche    = creator.niche ?? "general";

  // Engagement rate history (oldest → newest)
  const erHistory = [...creator.rawMetrics]
    .reverse()
    .map((m) => ((m.avgLikes + m.avgComments + (m.avgShares ?? 0)) / Math.max(1, m.followers)) * 100);

  // Raw snapshot object for downstream services
  const rawSnap = {
    creatorId,
    platform,
    snapshotAt:  latest.snapshotAt,
    followers:   latest.followers,
    following:   latest.following  ?? 0,
    totalPosts:  latest.totalPosts,
    avgLikes:    latest.avgLikes,
    avgComments: latest.avgComments,
    avgShares:   latest.avgShares  ?? 0,
    avgViews:    latest.avgViews   ?? 0,
    subscribers: latest.subscribers ?? undefined,
    totalVideos: latest.totalVideoCount ?? undefined,
    reachRate:   latest.reachRate  ?? undefined,
  };

  // ── 2. Core sub-scores ────────────────────────────────────
  const engScore  = calcEngagementScore(rawSnap);
  const growScore = calcGrowthScore(latest.followers, previous.followers, erHistory);
  const conScore  = calcConsistencyScore(latest.totalPosts, 30, erHistory, []);
  const authScore = calcAuthenticityScore(rawSnap, erHistory);
  const fitScore  = calcAudienceFitScore(rawSnap);

  // ── 3. Composite score ────────────────────────────────────
  const scores = calcCompositeScore(engScore, growScore, conScore, authScore, fitScore);

  // ── 4. Derived metrics ────────────────────────────────────
  const css     = calcCSS(conScore.score, authScore.score, growScore.trend);
  const gsi     = calcGSI(growScore.normalised, authScore.score, authScore.suspiciousSpike);
  const roiBand = calcROIBand(scores.compositeScore, scores.riskScore);

  // ── 5. Risk analysis ──────────────────────────────────────
  const riskAnalysis = calcRiskAnalysis(
    authScore.fakeBotRisk,
    conScore.volatility,
    authScore.suspiciousSpike,
    growScore.rawRate,
    engScore.raw,
    erHistory
  );

  // ── 6. Benchmark ──────────────────────────────────────────
  const benchmark = runBenchmark({
    engagementRate:       engScore.raw,
    growthRate:           growScore.rawRate,
    consistencyScore:     conScore.score,
    audienceQualityScore: fitScore.qualityProxy,
    postingFrequency:     conScore.postingFrequency,
    followers:            latest.followers,
    niche,
    platform,
  });

  // ── 7. Audience intelligence ──────────────────────────────
  const audienceIntelligence = runAudienceIntelligence({
    storedNiche:          creator.niche,
    consistencyScore:     conScore.score,
    audienceFitScore:     fitScore.score,
    engagementRate:       engScore.raw,
    avgLikes:             latest.avgLikes,
    avgComments:          latest.avgComments,
    volatility:           conScore.volatility,
  });

  // ── 8. ROI estimation ─────────────────────────────────────
  const roiEstimation = runROIEstimation({
    rawMetrics:          rawSnap,
    niche,
    engagementRate:      engScore.raw,
    nicheAvgEr:          benchmark.nicheAvgEr,
    purchaseIntentScore: audienceIntelligence.purchaseIntentScore,
    compositeScore:      scores.compositeScore,
    riskScore:           scores.riskScore,
  });

  // ── 9. Assemble report shell (no narration yet) ───────────
  const reportShell = buildReport({
    creatorId,
    creatorHandle: creator.handle,
    platform,
    niche,
    rawMetrics:    rawSnap,
    scores,
    css,
    gsi,
    roiBand,
    riskAnalysis,
    benchmark,
    audienceIntelligence,
    roiEstimation,
    aiReport: {
      executiveSummary:        "",
      performanceAnalysis:     "",
      riskExplanation:         "",
      roiJustification:        "",
      strategicRecommendation: "",
    },
  });

  // ── 10. AI narration (receives fully computed report) ─────
  const aiReport = await generateNarration(reportShell);

  // ── 11. Final report with narration ──────────────────────
  const finalReport: InvestmentReport = { ...reportShell, aiReport };

  // ── 12. Persist to DB ─────────────────────────────────────
  await prisma.report.create({
    data: {
      creatorId,
      riskLevel:         riskAnalysis.level as RiskLevel,
      rawMetrics:        rawSnap           as object,
      engineeredMetrics: { engScore, growScore, conScore, authScore, fitScore } as object,
      scores:            scores            as object,
      benchmark:         benchmark         as object,
      riskAnalysis:      riskAnalysis      as object,
      aiReport:          aiReport          as object,
    },
  });

  return finalReport;
}
