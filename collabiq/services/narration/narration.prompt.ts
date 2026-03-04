// ============================================================
// narration.prompt.ts  — AI Layer
// Builds the system + user prompts for the LLM narration call.
//
// DESIGN PRINCIPLE:
//   The LLM receives only pre-computed, validated numbers.
//   It never touches raw API data or performs calculations.
//   Its sole job is to convert structured JSON → narrative prose.
// ============================================================

import { InvestmentReport } from "@/types/global.types";

// ── System prompt ─────────────────────────────────────────────

export const SYSTEM_PROMPT = `\
You are a senior marketing intelligence analyst at a creator economy investment firm.
You generate concise, professional investment reports on social media creators.

HARD RULES — non-negotiable:
1. Interpret ONLY the exact figures provided. Never fabricate, estimate, or infer new numbers.
2. Never reference any creator, platform, or brand not explicitly named in the input.
3. Your tone is professional, analytical, and actionable.
4. Return ONLY a single valid JSON object. No markdown. No code fences. No preamble.
5. All five keys must be non-empty strings.`;

// ── User prompt builder ───────────────────────────────────────

export function buildUserPrompt(r: InvestmentReport): string {
  const s   = r.scores;
  const b   = r.benchmark;
  const risk= r.riskAnalysis;
  const f   = r.scores.breakdown;
  const roi = r.roiEstimation;
  const css = r.derivedMetrics.css;
  const gsi = r.derivedMetrics.gsi;

  return `\
Analyse the data below and return a JSON investment report.

CREATOR:  ${r.creatorHandle}
PLATFORM: ${r.platform}
NICHE:    ${r.niche}

── SCORES ────────────────────────────────────────────────
Composite Score:    ${s.compositeScore}/100
Investment Score:   ${s.investmentScore}/100
ROI Potential:      ${s.roiPotential}/100
Risk Score:         ${s.riskScore}/100

Score Breakdown:
  Engagement:   ${f.engagement}/100
  Growth:       ${f.growth}/100
  Consistency:  ${f.consistency}/100
  Authenticity: ${f.authenticity}/100
  Audience Fit: ${f.audienceFit}/100

── DERIVED METRICS ───────────────────────────────────────
Collaboration Stability (CSS): ${css.score}/100 [${css.label}]
Growth Sustainability (GSI):   ${gsi.score}/100 [sustainable: ${gsi.sustainableGrowth}]
ROI Band:  ${r.derivedMetrics.roiBand.band} (${r.derivedMetrics.roiBand.estimatedReturn}) — confidence: ${r.derivedMetrics.roiBand.confidence}

── BENCHMARK vs NICHE "${b.niche}" ──────────────────────
Percentile Rank:        ${b.percentileRank}th
Z-Score:                ${b.zScore}
Niche Avg ER:           ${b.nicheAvgEr}%
Niche Avg Growth:       ${b.nicheAvgGrowth}%
Creator Tier:           ${b.tier}

── RISK ANALYSIS ─────────────────────────────────────────
Risk Level:      ${risk.level}
Risk Score:      ${risk.score}/100
Trend:           ${risk.engagementTrend}
Flags (${risk.flags.length}): ${risk.flags.length ? risk.flags.map(f => `[${f.severity}] ${f.description}`).join(" | ") : "None"}

── ROI ESTIMATION ────────────────────────────────────────
Est. Impressions:   ${roi.estimatedImpressions.toLocaleString()}
Est. Clicks:        ${roi.estimatedClicks.toLocaleString()}
Est. Conversions:   ${roi.estimatedConversions.toLocaleString()}
Rationale: ${roi.rationale}

────────────────────────────────────────────────────────
Return ONLY this JSON object:

{
  "executiveSummary":        "2–3 sentence investment suitability summary",
  "performanceAnalysis":     "Analysis of engagement, growth, consistency vs niche benchmarks",
  "riskExplanation":         "Explanation of risk flags and investment implications",
  "roiJustification":        "Justification of ROI band and return estimate from provided data",
  "strategicRecommendation": "INVEST / WATCH / AVOID with one-sentence rationale"
}`;
}
