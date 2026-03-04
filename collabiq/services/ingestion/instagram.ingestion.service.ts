// ============================================================
// instagram.ingestion.service.ts
// TRD Section 5 — Data Ingestion Layer
//
// Fetches profile + media metrics from the Instagram Graph API.
// Writes a RawMetricsSnapshot to the DB via Prisma.
//
// Permissions required:
//   instagram_basic
//   instagram_manage_insights
// ============================================================

import { prisma } from "@/lib/prisma";
import { RawMetricsSnapshot } from "@/types/global.types";

// ── API response shapes ───────────────────────────────────────

interface IGProfile {
  id:              string;
  username:        string;
  name:            string;
  followers_count: number;
  follows_count:   number;
  media_count:     number;
}

interface IGMediaItem {
  id:             string;
  like_count:     number;
  comments_count: number;
  timestamp:      string;
  media_type:     "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
}

// ── Fetchers ──────────────────────────────────────────────────

async function fetchProfile(token: string): Promise<IGProfile> {
  const fields = "id,username,name,followers_count,follows_count,media_count";
  const res    = await fetch(`https://graph.instagram.com/me?fields=${fields}&access_token=${token}`);
  if (!res.ok) throw new Error(`[IG] Profile fetch failed: ${res.status}`);
  return res.json();
}

async function fetchRecentMedia(token: string): Promise<IGMediaItem[]> {
  const fields = "id,like_count,comments_count,timestamp,media_type";
  const res    = await fetch(`https://graph.instagram.com/me/media?fields=${fields}&limit=25&access_token=${token}`);
  if (!res.ok) throw new Error(`[IG] Media fetch failed: ${res.status}`);
  const data   = await res.json();
  return data.data ?? [];
}

// ── Main ingestion function ───────────────────────────────────

export async function ingestInstagram(creatorId: string): Promise<RawMetricsSnapshot> {
  const account = await prisma.platformAccount.findFirst({
    where:  { creatorId, platform: "INSTAGRAM" },
    select: { accessToken: true, tokenExpiry: true },
  });
  if (!account) throw new Error(`No Instagram account linked to creatorId=${creatorId}`);

  if (account.tokenExpiry && account.tokenExpiry < new Date()) {
    console.warn(`[IG Ingestion] Token expired for creatorId=${creatorId} — refresh required`);
    // TODO: call token refresh endpoint
  }

  const [profile, media] = await Promise.all([
    fetchProfile(account.accessToken),
    fetchRecentMedia(account.accessToken),
  ]);

  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const avgLikes    = avg(media.map((m) => m.like_count     ?? 0));
  const avgComments = avg(media.map((m) => m.comments_count ?? 0));

  await prisma.rawMetrics.create({
    data: {
      creatorId,
      platform:   "INSTAGRAM",
      followers:  profile.followers_count,
      following:  profile.follows_count,
      totalPosts: profile.media_count,
      avgLikes:   Math.round(avgLikes),
      avgComments:Math.round(avgComments),
      avgShares:  0,
      avgViews:   0,
    },
  });

  return {
    creatorId,
    platform:   "INSTAGRAM",
    snapshotAt: new Date(),
    followers:  profile.followers_count,
    following:  profile.follows_count,
    totalPosts: profile.media_count,
    avgLikes:   Math.round(avgLikes),
    avgComments:Math.round(avgComments),
    avgShares:  0,
    avgViews:   0,
  };
}
