// GET /api/creator/:id  — creator profile + latest snapshot
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const creator = await prisma.creator.findUnique({
      where: { id: params.id },
      include: {
        platformAccounts:  { select: { platform: true, platformId: true, tokenExpiry: true } },
        rawMetrics:        { orderBy: { snapshotAt: "desc" }, take: 1 },
        scores:            { orderBy: { calculatedAt: "desc" }, take: 1 },
      },
    });
    if (!creator) return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    return NextResponse.json({ creator });
  } catch (err) {
    console.error("[GET /api/creator/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
