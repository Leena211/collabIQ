// ============================================================
// report.types.ts  — TRD Section 11
// Types specific to the report builder layer.
// InvestmentReport is defined in global.types.ts.
// ============================================================

export interface ReportBuildInput {
  creatorId:     string;
  creatorHandle: string;
  platform:      string;
  niche:         string;
}
