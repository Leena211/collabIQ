// POST /api/auth/instagram
// OAuth 2.0: code → short-lived → long-lived token → upsert PlatformAccount
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { code, creatorId } = await req.json();
    if (!code || !creatorId) return NextResponse.json({ error: "code and creatorId required" }, { status: 400 });

    // Short-lived token
    const shortRes = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      body: new URLSearchParams({ client_id: process.env.INSTAGRAM_CLIENT_ID!, client_secret: process.env.INSTAGRAM_CLIENT_SECRET!, grant_type: "authorization_code", redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!, code }),
    });
    if (!shortRes.ok) return NextResponse.json({ error: "Short-lived exchange failed" }, { status: 400 });
    const short = await shortRes.json();

    // Long-lived token
    const longRes  = await fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${short.access_token}`);
    const long     = await longRes.json();

    // Profile
    const profile  = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${long.access_token}`).then(r => r.json());

    const tokenExpiry = new Date(Date.now() + long.expires_in * 1000);
    const account = await prisma.platformAccount.upsert({
      where:  { platform_platformId: { platform: "INSTAGRAM", platformId: profile.id } },
      update: { accessToken: long.access_token, tokenExpiry },
      create: { platform: "INSTAGRAM", platformId: profile.id, accessToken: long.access_token, tokenExpiry, scope: "instagram_basic,instagram_manage_insights", creatorId },
    });
    return NextResponse.json({ success: true, accountId: account.id });
  } catch (err) {
    console.error("[POST /api/auth/instagram]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
