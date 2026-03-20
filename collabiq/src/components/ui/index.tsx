"use client";

import React from "react";
import type { ScoreLabel, RiskClassification, ROIPotentialBand } from "@/types";
import {
  getScoreBadgeClasses,
  getRiskBadgeClasses,
  getROIBadgeClasses,
} from "@/lib/utils";

// ── Button ─────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  disabled,
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none";

  const sizes = {
    sm: "px-3 py-2 text-sm h-9",
    md: "px-5 py-2.5 text-sm h-11",
    lg: "px-7 py-3 text-base h-12",
  };

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm hover:shadow-indigo disabled:bg-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed",
    secondary:
      "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 active:bg-indigo-100 disabled:bg-white disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 disabled:text-slate-300 disabled:cursor-not-allowed",
    danger:
      "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      style={{ fontFamily: "var(--font-display)" }}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin"
          style={{ animation: "spin 1s linear infinite" }}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeOpacity="0.25"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        icon
      )}
      {children}
    </button>
  );
};

// ── Badge ──────────────────────────────────────────────────────────────────

interface BadgeProps {
  label: string;
  variant?: "score" | "risk" | "roi" | "platform" | "custom";
  scoreLabel?: ScoreLabel;
  riskClassification?: RiskClassification;
  roiBand?: ROIPotentialBand;
  customClass?: string;
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "custom",
  scoreLabel,
  riskClassification,
  roiBand,
  customClass = "",
  size = "sm",
}) => {
  let classes = "";

  if (variant === "score" && scoreLabel) {
    classes = getScoreBadgeClasses(scoreLabel);
  } else if (variant === "risk" && riskClassification) {
    classes = getRiskBadgeClasses(riskClassification);
  } else if (variant === "roi" && roiBand) {
    classes = getROIBadgeClasses(roiBand);
  } else {
    classes = customClass;
  }

  const sizeClasses = size === "md" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${sizeClasses} ${classes}`}
    >
      {label}
    </span>
  );
};

// ── Card ───────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  elevated = false,
  bordered = true,
}) => {
  return (
    <div
      className={`
        bg-white rounded-2xl
        ${bordered ? "border border-slate-200" : ""}
        ${elevated ? "shadow-lg" : "shadow-sm"}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// ── ScoreRing ──────────────────────────────────────────────────────────────

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  animated?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 80,
  strokeWidth = 7,
  color = "#4F46E5",
  label,
  animated = true,
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ width: size, height: size, position: "relative" }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={
              animated
                ? {
                    transition: "stroke-dashoffset 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }
                : undefined
            }
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: size * 0.27,
              fontWeight: 700,
              color: "#1E293B",
              fontFamily: "var(--font-display)",
              lineHeight: 1,
            }}
          >
            {score}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-xs font-medium text-slate-500">{label}</span>
      )}
    </div>
  );
};

// ── ProgressBar ────────────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  animated?: boolean;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = "#4F46E5",
  height = 8,
  animated = true,
  showLabel = false,
}) => {
  const pct = Math.min(100, (value / max) * 100);

  return (
    <div className="flex items-center gap-3 w-full">
      <div
        style={{
          flex: 1,
          height,
          background: "#E2E8F0",
          borderRadius: height,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: height,
            transition: animated ? "width 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)" : undefined,
          }}
        />
      </div>
      {showLabel && (
        <span
          className="text-sm font-semibold text-slate-700 tabular-nums"
          style={{ minWidth: 32 }}
        >
          {value}
        </span>
      )}
    </div>
  );
};

// ── PlatformIcon ───────────────────────────────────────────────────────────

interface PlatformIconProps {
  platform: "instagram" | "linkedin";
  size?: number;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({
  platform,
  size = 20,
}) => {
  if (platform === "instagram") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F58529" />
            <stop offset="50%" stopColor="#DD2A7B" />
            <stop offset="100%" stopColor="#8134AF" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig-grad)" />
        <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2">
      <rect x="2" y="2" width="20" height="20" rx="4" />
      <path
        d="M7 10v7M7 7v.5M11 17v-4a2 2 0 0 1 4 0v4M11 10v7"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

// ── Divider ────────────────────────────────────────────────────────────────

export const Divider: React.FC<{ className?: string }> = ({ className = "" }) => (
  <hr className={`border-slate-200 ${className}`} />
);

// ── StatPill ───────────────────────────────────────────────────────────────

interface StatPillProps {
  label: string;
  value: string | number;
}

export const StatPill: React.FC<StatPillProps> = ({ label, value }) => (
  <div className="flex flex-col items-center px-4 py-2">
    <span
      className="text-lg font-bold text-slate-800"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {value}
    </span>
    <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
      {label}
    </span>
  </div>
);

// ── Tooltip ────────────────────────────────────────────────────────────────

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => (
  <div className="relative group">
    {children}
    <div
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50"
    >
      <div className="bg-slate-800 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
      </div>
    </div>
  </div>
);

// ── Alert ──────────────────────────────────────────────────────────────────

interface AlertProps {
  type: "info" | "warning" | "error" | "success";
  title?: string;
  message: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ type, title, message, className = "" }) => {
  const styles = {
    info: { bg: "bg-indigo-50 border-indigo-200", text: "text-indigo-800", icon: "ℹ️" },
    warning: { bg: "bg-amber-50 border-amber-200", text: "text-amber-800", icon: "⚠️" },
    error: { bg: "bg-red-50 border-red-200", text: "text-red-800", icon: "✕" },
    success: { bg: "bg-green-50 border-green-200", text: "text-green-800", icon: "✓" },
  };

  const s = styles[type];

  return (
    <div className={`rounded-xl border p-4 ${s.bg} ${className}`}>
      <div className={`flex gap-3 ${s.text}`}>
        <span className="text-lg">{s.icon}</span>
        <div>
          {title && <p className="font-semibold mb-0.5">{title}</p>}
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};
