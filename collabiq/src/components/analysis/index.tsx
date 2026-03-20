"use client";

import React from "react";
import type { ProfileAnalysis, ScoreDimension } from "@/types";
import {
  Card,
  Badge,
  ScoreRing,
  ProgressBar,
  PlatformIcon,
  StatPill,
  Divider,
} from "@/components/ui";
import { formatFollowers } from "@/lib/utils";

// ── ProfileSummaryCard ──────────────────────────────────────────────────────

interface ProfileSummaryCardProps {
  analysis: ProfileAnalysis;
  highlighted?: boolean;
  accentColor?: string;
}

export const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({
  analysis,
  highlighted = false,
  accentColor = "#4F46E5",
}) => {
  const { profileSummary, riskClassification, roiPotentialBand, redFlags } = analysis;

  return (
    <Card
      className="overflow-hidden"
      elevated={highlighted}
      bordered={!highlighted}
    >
      {highlighted && (
        <div
          style={{
            background: accentColor,
            padding: "6px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span style={{ color: "white", fontSize: 12, fontWeight: 700, fontFamily: "var(--font-display)" }}>
            RECOMMENDED
          </span>
        </div>
      )}
      <div style={{ padding: 20 }}>
        {/* Avatar + Info */}
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}44)`,
                border: `2px solid ${accentColor}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
                color: accentColor,
                fontFamily: "var(--font-display)",
              }}
            >
              {profileSummary.displayName.charAt(0).toUpperCase()}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                background: "white",
                borderRadius: "50%",
                padding: 2,
              }}
            >
              <PlatformIcon platform={profileSummary.platform} size={18} />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--neutral-dark)",
                marginBottom: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {profileSummary.displayName}
            </p>
            <p style={{ fontSize: 13, color: "var(--neutral-mid)", marginBottom: 6 }}>
              @{profileSummary.handle}
            </p>
            <p
              style={{
                fontSize: 13,
                color: "var(--neutral-mid)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.5,
              }}
            >
              {profileSummary.bio}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "flex",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            margin: "0 -4px 14px",
          }}
        >
          <StatPill label="Followers" value={formatFollowers(profileSummary.followerCount)} />
          <div style={{ width: 1, background: "var(--border)" }} />
          <StatPill label="Following" value={formatFollowers(profileSummary.followingCount)} />
          <div style={{ width: 1, background: "var(--border)" }} />
          <StatPill label="Posts" value={formatFollowers(profileSummary.totalPosts)} />
        </div>

        {/* Badges Row */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Badge
            label={riskClassification}
            variant="risk"
            riskClassification={riskClassification}
            size="sm"
          />
          <Badge
            label={`${roiPotentialBand} ROI`}
            variant="roi"
            roiBand={roiPotentialBand}
            size="sm"
          />
          {profileSummary.accountAge && (
            <Badge
              label={`${profileSummary.accountAge} old`}
              customClass="bg-slate-100 text-slate-600 border-slate-200"
              size="sm"
            />
          )}
        </div>

        {/* Red Flags */}
        {redFlags.length > 0 && (
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {redFlags.map((flag) => (
              <div
                key={flag.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: flag.severity === "critical" ? "#FEE2E2" : "#FEF9C3",
                  borderRadius: 8,
                  padding: "6px 10px",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={flag.severity === "critical" ? "#DC2626" : "#A16207"}
                  strokeWidth="2.5"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" strokeLinecap="round" />
                </svg>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: flag.severity === "critical" ? "#DC2626" : "#A16207",
                  }}
                >
                  {flag.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

// ── ScoreDimensionCard ──────────────────────────────────────────────────────

interface ScoreDimensionCardProps {
  dimension: ScoreDimension;
  accentColor?: string;
  compact?: boolean;
}

export const ScoreDimensionCard: React.FC<ScoreDimensionCardProps> = ({
  dimension,
  accentColor = "#4F46E5",
  compact = false,
}) => {
  const scoreColor =
    dimension.score >= 75
      ? "#4F46E5"
      : dimension.score >= 55
      ? "#15803D"
      : dimension.score >= 35
      ? "#A16207"
      : "#DC2626";

  if (compact) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 0",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--neutral-dark)", marginBottom: 4 }}>
            {dimension.label}
          </p>
          <ProgressBar value={dimension.score} color={scoreColor} height={6} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 80, justifyContent: "flex-end" }}>
          <Badge
            label={dimension.scoreLabel}
            variant="score"
            scoreLabel={dimension.scoreLabel}
          />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: scoreColor,
              minWidth: 28,
              textAlign: "right",
            }}
          >
            {dimension.score}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-5">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--neutral-dark)",
              marginBottom: 6,
              fontFamily: "var(--font-display)",
            }}
          >
            {dimension.label}
          </p>
          <Badge label={dimension.scoreLabel} variant="score" scoreLabel={dimension.scoreLabel} size="sm" />
        </div>
        <ScoreRing score={dimension.score} size={64} strokeWidth={6} color={scoreColor} />
      </div>
      <ProgressBar value={dimension.score} color={scoreColor} height={6} />
      <p style={{ fontSize: 13, color: "var(--neutral-mid)", marginTop: 10, lineHeight: 1.6 }}>
        {dimension.interpretation}
      </p>
    </Card>
  );
};

// ── FullAnalysisView ────────────────────────────────────────────────────────

interface FullAnalysisViewProps {
  analysis: ProfileAnalysis;
  accentColor?: string;
}

export const FullAnalysisView: React.FC<FullAnalysisViewProps> = ({
  analysis,
  accentColor = "#4F46E5",
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header scores row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        <MetricTile
          label="Overall Score"
          value={analysis.overallScore}
          subtitle="Composite intelligence score"
          highlight
          color={accentColor}
        />
        <MetricTile
          label="Collaboration Fit"
          value={analysis.collaborationSuitabilityScore}
          subtitle="Suitability for brand partnership"
          color="#0D9488"
        />
        <MetricTile
          label="Risk Indicator"
          value={analysis.riskIndicatorScore}
          subtitle={analysis.riskClassification}
          color={
            analysis.riskClassification === "Low Risk"
              ? "#15803D"
              : analysis.riskClassification === "Moderate Risk"
              ? "#A16207"
              : "#DC2626"
          }
          inverseBar
        />
        <MetricTile
          label="Growth Sustainability"
          value={analysis.growthSustainabilityIndex}
          subtitle="Long-term trajectory strength"
          color="#7C3AED"
        />
      </div>

      {/* Score Dimensions */}
      <Card className="p-6">
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--neutral-dark)",
            marginBottom: 4,
          }}
        >
          Score Dimensions
        </h3>
        <p style={{ fontSize: 13, color: "var(--neutral-mid)", marginBottom: 16 }}>
          Five-factor analysis with benchmark-calibrated scoring
        </p>
        <div>
          {analysis.scoreDimensions.map((dim, i) => (
            <ScoreDimensionCard key={dim.id} dimension={dim} compact={false} accentColor={accentColor} />
          ))}
        </div>
      </Card>

      {/* AI Narrative */}
      <Card className="p-6">
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--primary-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--neutral-dark)",
                marginBottom: 8,
              }}
            >
              AI Investment Intelligence Summary
            </h3>
            <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7 }}>
              {analysis.aiNarrativeSummary}
            </p>
          </div>
        </div>
      </Card>

      {/* Benchmark Intelligence */}
      <Card className="p-6">
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--neutral-dark)",
            marginBottom: 4,
          }}
        >
          Benchmark Intelligence Layer
        </h3>
        <p style={{ fontSize: 13, color: "var(--neutral-mid)", marginBottom: 16 }}>
          Performance vs. niche and follower-band medians
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {analysis.benchmarkComparisons.map((bench, i) => (
            <BenchmarkRow key={i} bench={bench} />
          ))}
        </div>
      </Card>

      {/* Audience Intelligence + ROI */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card className="p-6">
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--neutral-dark)",
              marginBottom: 16,
            }}
          >
            Audience Intelligence
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <AudienceRow
              label="Detected Niche"
              value={analysis.audienceIntelligence.nicheLabel}
              badge={`${analysis.audienceIntelligence.nicheConfidence}% confidence`}
            />
            <AudienceRow
              label="Interest Clusters"
              value={analysis.audienceIntelligence.interestClusters.join(", ")}
            />
            <AudienceRow
              label="Purchase Intent"
              value={`${analysis.audienceIntelligence.purchaseIntentScore}/100`}
              score={analysis.audienceIntelligence.purchaseIntentScore}
            />
            <AudienceRow
              label="Engagement Quality"
              value={analysis.audienceIntelligence.engagementQualityIndicator}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--neutral-dark)",
              marginBottom: 16,
            }}
          >
            ROI Estimation Model
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                background: "var(--primary-light)",
                borderRadius: 12,
                padding: "12px 16px",
                marginBottom: 4,
              }}
            >
              <p style={{ fontSize: 12, color: "var(--neutral-mid)", marginBottom: 2 }}>ROI Potential Classification</p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "var(--primary)",
                }}
              >
                {analysis.roiEstimation.roiClassification}
              </p>
            </div>
            <ROIRow
              label="Est. Impressions"
              value={`${formatFollowers(analysis.roiEstimation.estimatedImpressionsRange[0])} – ${formatFollowers(analysis.roiEstimation.estimatedImpressionsRange[1])}`}
            />
            <ROIRow
              label="Est. CTR Band"
              value={`${analysis.roiEstimation.estimatedCTRBand[0]}% – ${analysis.roiEstimation.estimatedCTRBand[1]}%`}
            />
            <ROIRow
              label="Est. Conversions"
              value={`${formatFollowers(analysis.roiEstimation.estimatedConversionRange[0])} – ${formatFollowers(analysis.roiEstimation.estimatedConversionRange[1])}`}
            />
            <p style={{ fontSize: 12, color: "var(--neutral-mid)", lineHeight: 1.5, marginTop: 4 }}>
              {analysis.roiEstimation.rationale}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ── Sub-components ──────────────────────────────────────────────────────────

const MetricTile: React.FC<{
  label: string;
  value: number;
  subtitle: string;
  highlight?: boolean;
  color?: string;
  inverseBar?: boolean;
}> = ({ label, value, subtitle, highlight = false, color = "#4F46E5", inverseBar = false }) => (
  <Card className={`p-5 ${highlight ? "border-indigo-200" : ""}`}>
    <p style={{ fontSize: 12, fontWeight: 600, color: "var(--neutral-mid)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
      {label}
    </p>
    <p
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 40,
        color: highlight ? "var(--primary)" : color,
        lineHeight: 1,
        marginBottom: 6,
      }}
    >
      {value}
    </p>
    <p style={{ fontSize: 12, color: "var(--neutral-mid)", marginBottom: 8 }}>{subtitle}</p>
    <ProgressBar value={inverseBar ? 100 - value : value} color={color} height={4} />
  </Card>
);

const BenchmarkRow: React.FC<{ bench: typeof ProfileAnalysis.prototype extends never ? never : any }> = ({
  bench,
}) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
      <div>
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--neutral-dark)" }}>
          {bench.metric}
        </span>
        <span style={{ fontSize: 12, color: "var(--neutral-mid)", marginLeft: 8 }}>
          {bench.percentileContext}
        </span>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "var(--neutral-mid)" }}>
          Median: <strong>{bench.medianValue}</strong>
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: bench.isAboveMedian ? "#15803D" : "#DC2626",
          }}
        >
          Profile: {bench.profileValue}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 20,
            background: bench.isAboveMedian ? "#DCFCE7" : "#FEE2E2",
            color: bench.isAboveMedian ? "#15803D" : "#DC2626",
          }}
        >
          {bench.isAboveMedian ? "▲ Above" : "▼ Below"}
        </span>
      </div>
    </div>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div style={{ flex: 1, height: 6, background: "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${Math.min(100, (bench.profileValue / (bench.medianValue * 2)) * 100)}%`,
            background: bench.isAboveMedian ? "#15803D" : "#DC2626",
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  </div>
);

const AudienceRow: React.FC<{
  label: string;
  value: string;
  badge?: string;
  score?: number;
}> = ({ label, value, badge, score }) => (
  <div>
    <p style={{ fontSize: 12, color: "var(--neutral-mid)", marginBottom: 2 }}>{label}</p>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--neutral-dark)" }}>{value}</p>
      {badge && (
        <span
          style={{
            fontSize: 11,
            padding: "1px 8px",
            borderRadius: 20,
            background: "var(--primary-light)",
            color: "var(--primary)",
            fontWeight: 600,
          }}
        >
          {badge}
        </span>
      )}
    </div>
    {score !== undefined && (
      <ProgressBar value={score} color="#0D9488" height={4} />
    )}
  </div>
);

const ROIRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ fontSize: 13, color: "var(--neutral-mid)" }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--neutral-dark)" }}>{value}</span>
  </div>
);
