// POST /api/analyze  — run full pipeline (no narration for speed)
// For the narrated report use GET /api/report/:creatorId
import { NextRequest, NextResponse } from "next/server";
import { runAnalysisPipeline } from "../../../../services/orchestration";

export async function POST(req: NextRequest) {
  try {
    const { creatorId } = await req.json();
    if (!creatorId) return NextResponse.json({ error: "creatorId required" }, { status: 400 });
    const report = await runAnalysisPipeline(creatorId);
    // Strip aiReport from quick analyze response (use /report for full)
    const { aiReport: _, ...rest } = report;
    return NextResponse.json(rest);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    console.error("[POST /api/analyze]", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
