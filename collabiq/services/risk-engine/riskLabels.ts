export function assignRiskLabel(score: number): string {
  if (score < 40) return "Low Risk";
  if (score < 70) return "Medium Risk";
  return "High Risk";
}
