// ============================================================
// youtube.ingestion.service.ts
// TRD Section 5 — Data Ingestion Layer
//
// Fetches channel + video metrics from the YouTube Data API v3.
// Writes a RawMetricsSnapshot to the DB via Prisma.
//
// OAuth scope: https://www.googleapis.com/auth/youtube.readonly
// ============================================================

import { prisma } from "@/lib/prisma";
import { RawMetricsSnapshot } from "@/types/global.types";

// ── API response shapes ───────────────────────────────────────

interface YTChannelItem {
  id: string;
  statistics: { subscriberCount: string; videoCount: string; viewCount: string };
}

interface YTVideoItem {
  statistics: { viewCount: string; likeCount: string; commentCount: string };
}

const safeInt = (s?: string) => parseInt(s ?? "0", 10) || 0;

// ── Fetchers ──────────────────────────────────────────────────

async function fetchChannel(channelId: string, token: string): Promise<YTChannelItem> {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`[YT] Channel fetch failed: ${res.status}`);
  const data = await res.json();
  if (!data.items?.[0]) throw new Error(`[YT] Channel ${channelId} not found`);
  return data.items[0];
}

async function fetchRecentVideos(channelId: string, token: string): Promise<YTVideoItem[]> {
  const searchRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${channelId}&type=video&order=date&maxResults=20`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!searchRes.ok) throw new Error(`[YT] Search failed: ${searchRes.status}`);
  const searchData = await searchRes.json();
  const ids: string[] = (searchData.items ?? []).map((i: { id: { videoId: string } }) => i.id.videoId);
  if (!ids.length) return [];

  const statsRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids.join(",")}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const statsData = await statsRes.json();
  return statsData.items ?? [];
}

// ── Main ingestion function ───────────────────────────────────

export async function ingestYouTube(creatorId: string): Promise<RawMetricsSnapshot> {
  const account = await prisma.platformAccount.findFirst({
    where:  { creatorId, platform: "YOUTUBE" },
    select: { platformId: true, accessToken: true, tokenExpiry: true },
  });
  if (!account) throw new Error(`No YouTube account linked to creatorId=${creatorId}`);

  if (account.tokenExpiry && account.tokenExpiry < new Date()) {
    console.warn(`[YT Ingestion] Token expired for creatorId=${creatorId} — refresh required`);
    // TODO: Google refresh_token flow
  }

  const [channel, videos] = await Promise.all([
    fetchChannel(account.platformId, account.accessToken),
    fetchRecentVideos(account.platformId, account.accessToken),
  ]);

  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const avgViews    = avg(videos.map((v) => safeInt(v.statistics.viewCount)));
  const avgLikes    = avg(videos.map((v) => safeInt(v.statistics.likeCount)));
  const avgComments = avg(videos.map((v) => safeInt(v.statistics.commentCount)));
  const subscribers = safeInt(channel.statistics.subscriberCount);
  const totalVideos = safeInt(channel.statistics.videoCount);

  await prisma.rawMetrics.create({
    data: {
      creatorId,
      platform:       "YOUTUBE",
      followers:      subscribers,
      following:      0,
      totalPosts:     totalVideos,
      avgLikes:       Math.round(avgLikes),
      avgComments:    Math.round(avgComments),
      avgShares:      0,
      avgViews:       Math.round(avgViews),
      subscribers,
      totalVideoCount:totalVideos,
    },
  });

  return {
    creatorId,
    platform:   "YOUTUBE",
    snapshotAt: new Date(),
    followers:  subscribers,
    following:  0,
    totalPosts: totalVideos,
    avgLikes:   Math.round(avgLikes),
    avgComments:Math.round(avgComments),
    avgShares:  0,
    avgViews:   Math.round(avgViews),
    subscribers,
    totalVideos,
  };
}
