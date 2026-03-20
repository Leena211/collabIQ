"use client";

import React, { useEffect, useState } from "react";
import type { LoadingStep } from "@/types";

const STEPS: { id: LoadingStep; label: string; description: string }[] = [
  {
    id: "fetching",
    label: "Fetching profile data",
    description: "Extracting public signals from platform APIs",
  },
  {
    id: "scoring",
    label: "Running core scoring engine",
    description: "Computing 5-dimension scores and 4 derived components",
  },
  {
    id: "benchmarking",
    label: "Benchmarking against niche medians",
    description: "Comparing metrics against follower-band lookup tables",
  },
  {
    id: "generating",
    label: "Generating investment intelligence",
    description: "Producing AI narrative, ROI bands, and audience estimates",
  },
  {
    id: "complete",
    label: "Analysis complete",
    description: "Preparing your investment report",
  },
];

interface LoadingScreenProps {
  currentStep: LoadingStep;
  profileCount?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  currentStep,
  profileCount = 1,
}) => {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
  const progress = ((currentIndex + 1) / STEPS.length) * 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--neutral-light)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 48,
          animation: "fadeIn 0.5s ease forwards",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            background: "var(--primary)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 3v18h18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M7 16l4-6 4 3 4-7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 24,
            color: "var(--neutral-dark)",
            letterSpacing: "-0.5px",
          }}
        >
          Collab<span style={{ color: "var(--primary)" }}>IQ</span>
        </span>
      </div>

      {/* Main card */}
      <div
        style={{
          background: "white",
          border: "1px solid var(--border)",
          borderRadius: 24,
          padding: "40px 48px",
          maxWidth: 520,
          width: "100%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
          animation: "fadeInUp 0.5s ease forwards",
        }}
      >
        {/* Spinner + heading */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--primary-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              animation: "pulse-ring 2s infinite",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="2"
              style={{ animation: "spin 1.5s linear infinite" }}
            >
              <path
                d="M12 2a10 10 0 0 1 10 10"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="10" strokeOpacity="0.15" />
            </svg>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--neutral-dark)",
              marginBottom: 6,
            }}
          >
            Analyzing{" "}
            {profileCount > 1 ? `${profileCount} profiles` : "profile"}
          </h2>
          <p style={{ fontSize: 14, color: "var(--neutral-mid)" }}>
            Running 3-layer intelligence pipeline...
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              height: 8,
              background: "#E2E8F0",
              borderRadius: 4,
              overflow: "hidden",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #4F46E5, #7C3AED)",
                borderRadius: 4,
                transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "var(--neutral-mid)" }}>
              Step {currentIndex + 1} of {STEPS.length}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--primary)" }}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Steps list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {STEPS.map((step, i) => {
            const isDone = i < currentIndex;
            const isCurrent = i === currentIndex;
            const isPending = i > currentIndex;

            return (
              <div
                key={step.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: isCurrent
                    ? "var(--primary-light)"
                    : "transparent",
                  transition: "background 0.3s",
                }}
              >
                {/* Step indicator */}
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isDone
                      ? "#DCFCE7"
                      : isCurrent
                      ? "var(--primary)"
                      : "#E2E8F0",
                    transition: "background 0.3s",
                  }}
                >
                  {isDone ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#15803D"
                      strokeWidth="3"
                    >
                      <path
                        d="M20 6L9 17l-5-5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : isCurrent ? (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      style={{ animation: "spin 1.5s linear infinite" }}
                    >
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#94A3B8",
                      }}
                    />
                  )}
                </div>

                {/* Step info */}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent
                        ? "var(--primary)"
                        : isDone
                        ? "#15803D"
                        : "var(--neutral-mid)",
                      marginBottom: isCurrent ? 2 : 0,
                      transition: "color 0.3s",
                    }}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p
                      style={{
                        fontSize: 12,
                        color: "#6366F1",
                        animation: "fadeIn 0.3s ease",
                      }}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p
        style={{
          fontSize: 13,
          color: "var(--neutral-mid)",
          marginTop: 24,
          textAlign: "center",
        }}
      >
        This typically takes 5–15 seconds · Public data only
      </p>
    </div>
  );
};
