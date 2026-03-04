// GET /api/benchmarks/:niche  — static niche benchmark data
import { NextRequest, NextResponse } from "next/server";
import { NICHE_BENCHMARKS, resolveNiche } from "../../../../services/benchmark-intelligence";

export async function GET(_req: NextRequest, { params }: { params: { niche: string } }) {
  const key  = resolveNiche(params.niche);
  return NextResponse.json({ niche: key, benchmarks: NICHE_BENCHMARKS[key] });
}
