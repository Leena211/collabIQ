"use client";

import React from "react";
import Link from "next/link";

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  showBack = false,
  onBack,
  title,
  actions,
}) => {
  return (
    <header
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Left side */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {showBack && onBack && (
            <button
              onClick={onBack}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--neutral-mid)",
                fontSize: 14,
                fontWeight: 500,
                padding: "6px 0",
                transition: "color 0.15s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.color = "var(--primary)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.color = "var(--neutral-mid)")
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
          )}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: "var(--primary)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <circle cx="12" cy="6" r="2" fill="white" />
                <path
                  d="M8 17 L8 12 Q12 9 16 12 L16 17"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 20,
                color: "var(--neutral-dark)",
                letterSpacing: "-0.5px",
              }}
            >
              Collab<span style={{ color: "var(--primary)" }}>IQ</span>
            </span>
          </Link>

          {title && (
            <>
              <span style={{ color: "var(--border)", fontSize: 18 }}>/</span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--neutral-mid)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {title}
              </span>
            </>
          )}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {actions}
          <Link
            href="/analyze"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "var(--primary)",
              color: "white",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 13,
              padding: "8px 16px",
              borderRadius: 8,
              textDecoration: "none",
              transition: "background 0.15s, box-shadow 0.15s",
              boxShadow: "0 2px 8px rgba(79,70,229,0.25)",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--primary-dark)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--primary)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            Analyze
          </Link>
        </div>
      </div>
    </header>
  );
};

// ── Page Layout ────────────────────────────────────────────────────────────

interface PageLayoutProps {
  children: React.ReactNode;
  headerProps?: HeaderProps;
  maxWidth?: number;
  padded?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  headerProps,
  maxWidth = 1280,
  padded = true,
}) => {
  return (
    <div style={{ minHeight: "100vh", background: "var(--neutral-light)" }}>
      <Header {...headerProps} />
      <main
        style={{
          maxWidth,
          margin: "0 auto",
          padding: padded ? "32px 24px 64px" : undefined,
        }}
      >
        {children}
      </main>
    </div>
  );
};
