// ============================================================
// niche.benchmark.ts  — TRD Section 7
// Static niche benchmark data and comparison logic.
// Replace with DB-aggregated averages in production:
//   SELECT niche, AVG(er), STDDEV(er) FROM EngineeredMetrics ...
// ============================================================

import { MetricComparison } from "@/types/global.types";

export interface NicheStats { mean: number; median: number; stdDev: number }
export interface NicheBenchmarkData {
  engagementRate:   NicheStats;
  growthRate:       NicheStats;
  consistency:      NicheStats;
  audienceQuality:  NicheStats;
  postingFrequency: NicheStats;
}

export const NICHE_BENCHMARKS: Record<string, NicheBenchmarkData> = {
  fitness:  { engagementRate:{mean:3.5,median:3.0,stdDev:1.2},  growthRate:{mean:2.5,median:2.0,stdDev:1.5},  consistency:{mean:.65,median:.70,stdDev:.15}, audienceQuality:{mean:55,median:58,stdDev:12}, postingFrequency:{mean:4.5,median:4.0,stdDev:1.8} },
  tech:     { engagementRate:{mean:2.8,median:2.5,stdDev:1.0},  growthRate:{mean:3.0,median:2.5,stdDev:2.0},  consistency:{mean:.60,median:.62,stdDev:.18}, audienceQuality:{mean:60,median:62,stdDev:10}, postingFrequency:{mean:3.0,median:3.0,stdDev:1.5} },
  beauty:   { engagementRate:{mean:4.2,median:4.0,stdDev:1.5},  growthRate:{mean:2.0,median:1.8,stdDev:1.2},  consistency:{mean:.70,median:.72,stdDev:.12}, audienceQuality:{mean:52,median:55,stdDev:14}, postingFrequency:{mean:5.0,median:5.0,stdDev:2.0} },
  gaming:   { engagementRate:{mean:3.0,median:2.8,stdDev:1.4},  growthRate:{mean:3.5,median:3.0,stdDev:2.5},  consistency:{mean:.55,median:.58,stdDev:.22}, audienceQuality:{mean:48,median:50,stdDev:16}, postingFrequency:{mean:5.5,median:5.0,stdDev:2.5} },
  finance:  { engagementRate:{mean:2.2,median:2.0,stdDev:0.9},  growthRate:{mean:2.0,median:1.5,stdDev:1.8},  consistency:{mean:.68,median:.70,stdDev:.14}, audienceQuality:{mean:65,median:66,stdDev:9},  postingFrequency:{mean:3.5,median:3.0,stdDev:1.4} },
  lifestyle:{ engagementRate:{mean:3.8,median:3.5,stdDev:1.3},  growthRate:{mean:2.2,median:2.0,stdDev:1.4},  consistency:{mean:.62,median:.65,stdDev:.17}, audienceQuality:{mean:50,median:52,stdDev:13}, postingFrequency:{mean:4.0,median:4.0,stdDev:1.6} },
  food:     { engagementRate:{mean:4.0,median:3.8,stdDev:1.4},  growthRate:{mean:1.8,median:1.5,stdDev:1.1},  consistency:{mean:.66,median:.68,stdDev:.13}, audienceQuality:{mean:53,median:55,stdDev:12}, postingFrequency:{mean:4.2,median:4.0,stdDev:1.7} },
  general:  { engagementRate:{mean:3.0,median:2.8,stdDev:1.3},  growthRate:{mean:2.0,median:1.8,stdDev:1.5},  consistency:{mean:.60,median:.62,stdDev:.20}, audienceQuality:{mean:50,median:52,stdDev:15}, postingFrequency:{mean:3.5,median:3.5,stdDev:2.0} },
};

export function resolveNiche(niche: string): string {
  const k = niche.toLowerCase().trim();
  return k in NICHE_BENCHMARKS ? k : "general";
}

// z-score + CDF approximation → percentile
function z(val: number, s: NicheStats): number {
  return s.stdDev > 0 ? (val - s.mean) / s.stdDev : 0;
}

function percentile(z: number): number {
  const t   = 1 / (1 + 0.2316419 * Math.abs(z));
  const poly = 0.319381530*t - 0.356563782*t**2 + 1.781477937*t**3 - 1.821255978*t**4 + 1.330274429*t**5;
  const phi  = 1 - (1/Math.sqrt(2*Math.PI)) * Math.exp(-0.5*z*z) * poly;
  return Math.round(Math.min(1, Math.max(0, z >= 0 ? phi : 1 - phi)) * 100);
}

export function compareToNiche(value: number, stats: NicheStats): MetricComparison {
  const zs  = z(value, stats);
  const pct = percentile(zs);
  return {
    creatorValue:   Math.round(value * 100) / 100,
    benchmarkMean:  stats.mean,
    benchmarkMedian:stats.median,
    percentile:     pct,
    isAboveAverage: value > stats.mean,
  };
}
