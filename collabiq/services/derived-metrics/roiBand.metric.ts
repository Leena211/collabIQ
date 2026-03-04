// ============================================================
// roiBand.metric.ts  — TRD Section 6.5
// ROI Band Classification
//
// Maps composite score to a qualitative ROI band with an
// estimated return range and confidence level.
//
// Band thresholds (compositeScore):
//   ≥ 80 → VERY_HIGH  (5x–10x)
//   ≥ 65 → HIGH       (3x–5x)
//   ≥ 50 → MEDIUM     (1.5x–3x)
//   ≥ 35 → LOW        (1x–1.5x)
//    < 35 → VERY_LOW  (<1x)
//
// Confidence reduced if riskScore > 60.
// ============================================================

import { ROIBandOutput, ROIBand } from "@/types/global.types";

interface BandConfig { band: ROIBand; estimatedReturn: string }

const BANDS: Array<{ minScore: number } & BandConfig> = [
  { minScore: 80, band: "VERY_HIGH", estimatedReturn: "5x–10x" },
  { minScore: 65, band: "HIGH",      estimatedReturn: "3x–5x"  },
  { minScore: 50, band: "MEDIUM",    estimatedReturn: "1.5x–3x"},
  { minScore: 35, band: "LOW",       estimatedReturn: "1x–1.5x"},
  { minScore:  0, band: "VERY_LOW",  estimatedReturn: "<1x"    },
];

export function calcROIBand(compositeScore: number, riskScore: number): ROIBandOutput {
  const config     = BANDS.find((b) => compositeScore >= b.minScore) ?? BANDS[BANDS.length - 1];
  const confidence: ROIBandOutput["confidence"] = riskScore > 60 ? "LOW" : riskScore > 35 ? "MEDIUM" : "HIGH";

  return {
    band:            config.band,
    estimatedReturn: config.estimatedReturn,
    confidence,
  };
}
