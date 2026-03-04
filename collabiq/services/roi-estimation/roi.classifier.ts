// ============================================================
// roi.classifier.ts  — TRD Section 9
// Maps compositeScore + riskScore → ROI band + return range.
//
// Band thresholds:
//   compositeScore ≥ 80 → VERY_HIGH (5x–10x)
//   compositeScore ≥ 65 → HIGH      (3x–5x)
//   compositeScore ≥ 50 → MEDIUM    (1.5x–3x)
//   compositeScore ≥ 35 → LOW       (1x–1.5x)
//                        → VERY_LOW (<1x)
//
// Confidence degrades with high riskScore.
// ============================================================

import { ROIBandOutput, ROIBand } from "@/types/global.types";

const BAND_MAP: Array<{ min: number; band: ROIBand; range: string }> = [
  { min: 80, band: "VERY_HIGH", range: "5x–10x" },
  { min: 65, band: "HIGH",      range: "3x–5x"  },
  { min: 50, band: "MEDIUM",    range: "1.5x–3x"},
  { min: 35, band: "LOW",       range: "1x–1.5x"},
  { min:  0, band: "VERY_LOW",  range: "<1x"    },
];

export function classifyROI(compositeScore: number, riskScore: number): ROIBandOutput {
  const entry = BAND_MAP.find((b) => compositeScore >= b.min) ?? BAND_MAP[BAND_MAP.length - 1];
  const confidence: ROIBandOutput["confidence"] =
    riskScore > 60 ? "LOW" : riskScore > 35 ? "MEDIUM" : "HIGH";
  return { band: entry.band, estimatedReturn: entry.range, confidence };
}
