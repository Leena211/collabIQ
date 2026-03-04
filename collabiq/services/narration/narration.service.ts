// ============================================================
// narration.service.ts  — AI Layer (STRICTLY OUTPUT ONLY)
// TRD: AI narration is the final transformation step.
//
// Input:  fully computed InvestmentReport (all numbers resolved)
// Output: NarrationOutput — five prose fields
//
// The LLM NEVER:
//   - Computes scores
//   - Fetches data
//   - Fabricates metrics
//
// If the LLM call fails, a structured fallback is returned
// so the pipeline does not break.
// ============================================================

import OpenAI from "openai";
import { InvestmentReport, NarrationOutput } from "@/types/global.types";
import { SYSTEM_PROMPT, buildUserPrompt }    from "./narration.prompt";

// ── Client initialiser ────────────────────────────────────────

function getClient(): OpenAI {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not configured");
  return new OpenAI({ apiKey: key });
}

// ── Fallback (zero LLM dependency) ───────────────────────────

function buildFallback(r: InvestmentReport): NarrationOutput {
  const s    = r.scores;
  const risk = r.riskAnalysis;
  const roi  = r.roiEstimation;
  return {
    executiveSummary:
      `AI narration unavailable. ${r.creatorHandle} scored ${s.compositeScore}/100 composite ` +
      `with ${risk.level} risk on ${r.platform}.`,
    performanceAnalysis:
      `Investment: ${s.investmentScore}/100. ROI Potential: ${s.roiPotential}/100. ` +
      `Niche percentile: ${r.benchmark.percentileRank}th. Trend: ${risk.engagementTrend}.`,
    riskExplanation:
      risk.flags.length ? risk.flags.map((f) => f.description).join(" ") : risk.summary,
    roiJustification:
      `ROI band: ${roi.band} (${roi.estimatedReturn}). ${roi.rationale}`,
    strategicRecommendation:
      `Manual review required — AI narration unavailable. Risk: ${risk.level}. Composite: ${s.compositeScore}/100.`,
  };
}

// ── Main narration call ───────────────────────────────────────

export async function generateNarration(report: InvestmentReport): Promise<NarrationOutput> {
  try {
    const client = getClient();

    const completion = await client.chat.completions.create({
      model:       "gpt-4o-mini", // upgrade to gpt-4o for production
      temperature: 0.6,
      max_tokens:  1000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT           },
        { role: "user",   content: buildUserPrompt(report) },
      ],
    });

    const raw     = completion.choices[0]?.message?.content?.trim() ?? "";
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed  = JSON.parse(cleaned) as NarrationOutput;

    // Validate shape
    const keys: (keyof NarrationOutput)[] = [
      "executiveSummary","performanceAnalysis","riskExplanation","roiJustification","strategicRecommendation"
    ];
    for (const k of keys) {
      if (typeof parsed[k] !== "string" || !parsed[k].trim()) throw new Error(`Missing key: ${k}`);
    }

    return parsed;
  } catch (err) {
    console.error("[NarrationService] LLM call failed — fallback active:", err);
    return buildFallback(report);
  }
}
