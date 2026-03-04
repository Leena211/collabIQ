// GET /api/report/:creatorId  — full pipeline including AI narration
// Returns complete InvestmentReport JSON and persists to DB.
import { NextRequest, NextResponse } from "next/server";
import { runAnalysisPipeline } from "../../../../services/orchestration";

export async function GET(_req: NextRequest, { params }: { params: { creatorId: string } }) {
  try {
    const report = await runAnalysisPipeline(params.creatorId);
    return NextResponse.json(report);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    console.error("[GET /api/report/:creatorId]", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
