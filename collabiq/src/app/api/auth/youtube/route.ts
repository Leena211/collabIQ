// POST /api/auth/youtube
// Google OAuth 2.0: code → tokens → YouTube channel → upsert PlatformAccount
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { code, creatorId } = await req.json();
    if (!code || !creatorId) return NextResponse.json({ error: "code and creatorId required" }, { status: 400 });

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: process.env.GOOGLE_CLIENT_ID!, client_secret: process.env.GOOGLE_CLIENT_SECRET!, redirect_uri: process.env.GOOGLE_REDIRECT_URI!, grant_type: "authorization_code" }),
    });
    if (!tokenRes.ok) return NextResponse.json({ error: "Token exchange failed" }, { status: 400 });
    const tokens = await tokenRes.json();

    const channelData = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", { headers: { Authorization: `Bearer ${tokens.access_token}` } }).then(r => r.json());
    const channel     = channelData.items?.[0];
    if (!channel) return NextResponse.json({ error: "No YouTube channel found" }, { status: 404 });

    const tokenExpiry = new Date(Date.now() + tokens.expires_in * 1000);
    const account = await prisma.platformAccount.upsert({
      where:  { platform_platformId: { platform: "YOUTUBE", platformId: channel.id } },
      update: { accessToken: tokens.access_token, refreshToken: tokens.refresh_token, tokenExpiry },
      create: { platform: "YOUTUBE", platformId: channel.id, accessToken: tokens.access_token, refreshToken: tokens.refresh_token, tokenExpiry, scope: tokens.scope, creatorId },
    });
    return NextResponse.json({ success: true, accountId: account.id, channelId: channel.id });
  } catch (err) {
    console.error("[POST /api/auth/youtube]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
