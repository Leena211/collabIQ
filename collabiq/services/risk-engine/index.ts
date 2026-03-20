import { RiskInput, RiskOutput } from "./riskEngine.types";
import { calcRiskAnalysis } from "./riskScore.calculator";
import { detectRiskFlags } from "./riskFlags.detector";
import { assignRiskLabel } from "./riskLabels";

// Main orchestrator
export function runRiskEngine(input: RiskInput): RiskOutput {
  const score = calcRiskAnalysis(input.benchmark, input.audience);
  const flags = detectRiskFlags(input.benchmark, input.audience);
  const label = assignRiskLabel(score);

  return { score, label, flags };
}

// Keep your barrel exports too
export { calcRiskAnalysis } from "./riskScore.calculator";
export * from "./riskFlags.detector";
