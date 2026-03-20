"use client";

import React from "react";
import type { ComparisonResult, ScoreDimension } from "@/types";
import { Card, Badge, ProgressBar, ScoreRing } from "@/components/ui";
import { ProfileSummaryCard, ScoreDimensionCard } from "@/components/analysis";
import { getProfileComparisonColors } from "@/lib/utils";

interface ComparisonViewProps {
  result: ComparisonResult;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ result }) => {
  const colors = getProfileComparisonColors();
  const { profiles, recommendedProfileId, aiComparisonSummary } = result;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Profile Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${profiles.length}, 1fr)`,
          gap: 16,
        }}
      >
        {profiles.map((profile, i) => (
          <ProfileSummaryCard
            key={profile.id}
            analysis={profile}
            highlighted={profile.id === recommendedProfileId}
            accentColor={colors[i]}
          />
        ))}
      </div>

      {/* Comparison Score Bar Chart */}
      <ComparisonScoreChart profiles={profiles} colors={colors} />

      {/* Side-by-Side Scores */}
      <SideBySideScores profiles={profiles} colors={colors} />

      {/* AI Comparison Summary */}
      <Card className="p-6">
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--neutral-dark)",
                marginBottom: 10,
              }}
            >
              AI Comparison Intelligence
            </h3>
            <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7 }}>
              {aiComparisonSummary}
            </p>
          </div>
        </div>
      </Card>

      {/* Individual Full Analyses — collapsible or tabbed */}
      <IndividualAnalysesTabs profiles={profiles} colors={colors} />
    </div>
  );
};

// ── ComparisonScoreChart ────────────────────────────────────────────────────

const ComparisonScoreChart: React.FC<{
  profiles: ComparisonResult["profiles"];
  colors: string[];
}> = ({ profiles, colors }) => {
  const dimensions = profiles[0].scoreDimensions.map((d) => d.label);

  return (
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
        Score Comparison
      </h3>
      <p style={{ fontSize: 13, color: "var(--neutral-mid)", marginBottom: 20 }}>
        All dimensions across profiles — color-coded per profile
      </p>

      {/* Legend */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        {profiles.map((p, i) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: colors[i],
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--neutral-dark)" }}>
              @{p.profileSummary.handle}
            </span>
          </div>
        ))}
      </div>

      {/* Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {dimensions.map((dimLabel, dimIndex) => (
          <div key={dimLabel}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--neutral-mid)", marginBottom: 8 }}>
              {dimLabel}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {profiles.map((profile, pi) => {
                const dim = profile.scoreDimensions[dimIndex];
                return (
                  <div key={profile.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 4,
                        height: 24,
                        borderRadius: 2,
                        background: colors[pi],
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <div
                          style={{
                            flex: 1,
                            height: 10,
                            background: "#E2E8F0",
                            borderRadius: 5,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${dim.score}%`,
                              background: colors[pi],
                              borderRadius: 5,
                              transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: colors[pi],
                            minWidth: 28,
                            textAlign: "right",
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          {dim.score}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ── SideBySideScores ────────────────────────────────────────────────────────

const SideBySideScores: React.FC<{
  profiles: ComparisonResult["profiles"];
  colors: string[];
}> = ({ profiles, colors }) => {
  return (
    <Card className="overflow-hidden">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "180px " + profiles.map(() => "1fr").join(" "),
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ padding: "14px 16px" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--neutral-mid)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Metric
          </span>
        </div>
        {profiles.map((p, i) => (
          <div
            key={p.id}
            style={{
              padding: "14px 16px",
              borderLeft: "1px solid var(--border)",
              background: `${colors[i]}08`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: colors[i] }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--neutral-dark)" }}>
                @{p.profileSummary.handle}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Overall + key scores */}
      {[
        {
          label: "Overall Score",
          getValue: (p: typeof profiles[0]) => p.overallScore,
        },
        {
          label: "Collaboration Fit",
          getValue: (p: typeof profiles[0]) => p.collaborationSuitabilityScore,
        },
        {
          label: "Growth Sustainability",
          getValue: (p: typeof profiles[0]) => p.growthSustainabilityIndex,
        },
        {
          label: "Risk Indicator",
          getValue: (p: typeof profiles[0]) => p.riskIndicatorScore,
          inverse: true,
        },
      ].map((row, rowIndex) => (
        <div
          key={row.label}
          style={{
            display: "grid",
            gridTemplateColumns: "180px " + profiles.map(() => "1fr").join(" "),
            borderBottom: "1px solid var(--border)",
            background: rowIndex % 2 === 0 ? "white" : "#FAFAFA",
          }}
        >
          <div style={{ padding: "12px 16px", display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--neutral-mid)" }}>
              {row.label}
            </span>
          </div>
          {profiles.map((p, i) => {
            const val = row.getValue(p);
            const allVals = profiles.map(row.getValue);
            const best = row.inverse ? Math.min(...allVals) : Math.max(...allVals);
            const isBest = val === best;
            return (
              <div
                key={p.id}
                style={{
                  padding: "12px 16px",
                  borderLeft: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 20,
                    color: isBest ? colors[i] : "var(--neutral-dark)",
                  }}
                >
                  {val}
                </span>
                {isBest && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: `${colors[i]}15`,
                      color: colors[i],
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Best
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Dimension scores */}
      {profiles[0].scoreDimensions.map((dim, dimIndex) => (
        <div
          key={dim.id}
          style={{
            display: "grid",
            gridTemplateColumns: "180px " + profiles.map(() => "1fr").join(" "),
            borderBottom: "1px solid var(--border)",
            background: dimIndex % 2 === 0 ? "#FAFAFA" : "white",
          }}
        >
          <div style={{ padding: "12px 16px", display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--neutral-mid)" }}>{dim.label}</span>
          </div>
          {profiles.map((p, i) => {
            const d = p.scoreDimensions[dimIndex];
            const allScores = profiles.map((pr) => pr.scoreDimensions[dimIndex].score);
            const isBest = d.score === Math.max(...allScores);
            return (
              <div
                key={p.id}
                style={{
                  padding: "12px 16px",
                  borderLeft: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 16,
                    color: isBest ? colors[i] : "var(--neutral-dark)",
                  }}
                >
                  {d.score}
                </span>
                <Badge label={d.scoreLabel} variant="score" scoreLabel={d.scoreLabel} />
              </div>
            );
          })}
        </div>
      ))}
    </Card>
  );
};

// ── IndividualAnalysesTabs ──────────────────────────────────────────────────

const IndividualAnalysesTabs: React.FC<{
  profiles: ComparisonResult["profiles"];
  colors: string[];
}> = ({ profiles, colors }) => {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 18,
          color: "var(--neutral-dark)",
          marginBottom: 16,
        }}
      >
        Individual Profile Details
      </h3>
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          background: "var(--border)",
          padding: 4,
          borderRadius: 12,
          marginBottom: 20,
          width: "fit-content",
        }}
      >
        {profiles.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setActiveTab(i)}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 13,
              transition: "all 0.2s",
              background: activeTab === i ? "white" : "transparent",
              color: activeTab === i ? colors[i] : "var(--neutral-mid)",
              boxShadow: activeTab === i ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}
          >
            @{p.profileSummary.handle}
          </button>
        ))}
      </div>

      {/* Tab content - compact dimension list */}
      <Card className="p-6">
        <div>
          {profiles[activeTab].scoreDimensions.map((dim) => (
            <ScoreDimensionCard key={dim.id} dimension={dim} compact accentColor={colors[activeTab]} />
          ))}
        </div>
        <div
          style={{
            marginTop: 16,
            padding: "16px",
            background: "var(--primary-light)",
            borderRadius: 12,
          }}
        >
          <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.7 }}>
            {profiles[activeTab].aiNarrativeSummary}
          </p>
        </div>
      </Card>
    </div>
  );
};
