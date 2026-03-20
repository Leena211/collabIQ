"use client";

import React, { useState, useRef, useEffect } from "react";
import type { Platform, InputProfile, ManualInputData, AnalysisMode } from "@/types";
import { Button, Badge, PlatformIcon, Alert } from "@/components/ui";
import { detectPlatform, validateProfileInput, extractHandle } from "@/lib/utils";

// ── ProfileInputField ───────────────────────────────────────────────────────

interface ProfileInputFieldProps {
  profile: InputProfile;
  index: number;
  onUpdate: (id: string, value: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
  placeholder?: string;
}

export const ProfileInputField: React.FC<ProfileInputFieldProps> = ({
  profile,
  index,
  onUpdate,
  onRemove,
  canRemove,
  placeholder,
}) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(profile.id, e.target.value);
  };

  const hasError = profile.value.length > 0 && !profile.isValid;
  const hasSuccess = profile.value.length > 0 && profile.isValid;

  const borderColor = hasError
    ? "#DC2626"
    : hasSuccess
    ? "#15803D"
    : focused
    ? "#4F46E5"
    : "#E2E8F0";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--neutral-mid)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        Profile {index + 1}
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          border: `2px solid ${borderColor}`,
          borderRadius: 12,
          background: "white",
          overflow: "hidden",
          transition: "border-color 0.15s, box-shadow 0.15s",
          boxShadow: focused ? `0 0 0 3px ${borderColor}22` : undefined,
        }}
      >
        {/* Platform badge / icon */}
        <div
          style={{
            padding: "0 14px",
            borderRight: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            height: 48,
            background: "#F8FAFC",
            minWidth: 52,
            justifyContent: "center",
          }}
        >
          {profile.platform ? (
            <PlatformIcon platform={profile.platform} size={20} />
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={profile.value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={
            placeholder ||
            "Paste Instagram/LinkedIn URL or enter @handle"
          }
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            padding: "0 16px",
            height: 48,
            fontSize: 14,
            color: "var(--neutral-dark)",
            background: "transparent",
            fontFamily: "var(--font-body)",
          }}
        />

        {/* Status icon */}
        {hasSuccess && (
          <div style={{ paddingRight: 12 }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#15803D"
              strokeWidth="2.5"
            >
              <path
                d="M20 6L9 17l-5-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* Remove button */}
        {canRemove && (
          <button
            onClick={() => onRemove(profile.id)}
            style={{
              padding: "0 14px",
              height: 48,
              border: "none",
              borderLeft: "1px solid var(--border)",
              background: "transparent",
              cursor: "pointer",
              color: "#94A3B8",
              display: "flex",
              alignItems: "center",
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#DC2626";
              (e.currentTarget as HTMLElement).style.background = "#FEF2F2";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#94A3B8";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Helper text */}
      {profile.value.length > 0 && (
        <p style={{ fontSize: 12, color: hasError ? "#DC2626" : "#15803D" }}>
          {hasError
            ? "Invalid URL or handle. Try: https://instagram.com/username or @username"
            : profile.platform
            ? `✓ Detected: ${profile.platform.charAt(0).toUpperCase() + profile.platform.slice(1)}`
            : "✓ Valid handle detected"}
        </p>
      )}
    </div>
  );
};

// ── ProfileInputForm ────────────────────────────────────────────────────────

interface ProfileInputFormProps {
  mode: AnalysisMode;
  onModeChange: (mode: AnalysisMode) => void;
  onSubmit: (profiles: InputProfile[]) => void;
  loading?: boolean;
  error?: string | null;
}

export const ProfileInputForm: React.FC<ProfileInputFormProps> = ({
  mode,
  onModeChange,
  onSubmit,
  loading = false,
  error,
}) => {
  const [profiles, setProfiles] = useState<InputProfile[]>([
    { id: "1", value: "", platform: undefined, isValid: false },
  ]);

  const updateProfile = (id: string, value: string) => {
    const platform = detectPlatform(value);
    const isValid = validateProfileInput(value);
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, value, platform, isValid } : p))
    );
  };

  const addProfile = () => {
    if (profiles.length < 3) {
      setProfiles((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          value: "",
          platform: undefined,
          isValid: false,
        },
      ]);
    }
  };

  const removeProfile = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleModeSwitch = (newMode: AnalysisMode) => {
    onModeChange(newMode);
    if (newMode === "single") {
      setProfiles([{ id: "1", value: "", platform: undefined, isValid: false }]);
    } else if (profiles.length < 2) {
      setProfiles((prev) => [
        ...prev,
        { id: "2", value: "", platform: undefined, isValid: false },
      ]);
    }
  };

  const validCount = profiles.filter((p) => p.isValid).length;
  const canSubmit =
    mode === "single"
      ? validCount >= 1
      : validCount >= 2;

  const handleSubmit = () => {
    if (canSubmit) {
      onSubmit(profiles.filter((p) => p.isValid));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Mode Selector */}
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--neutral-mid)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Analysis Mode
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <ModeCard
            label="Single Profile"
            description="Deep-dive analysis of one creator"
            icon="👤"
            active={mode === "single"}
            onClick={() => handleModeSwitch("single")}
          />
          <ModeCard
            label="Compare Profiles"
            description="Side-by-side of 2–3 creators"
            icon="⚡"
            active={mode === "compare"}
            onClick={() => handleModeSwitch("compare")}
          />
        </div>
      </div>

      {/* Profile Inputs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {profiles.map((profile, index) => (
          <ProfileInputField
            key={profile.id}
            profile={profile}
            index={index}
            onUpdate={updateProfile}
            onRemove={removeProfile}
            canRemove={profiles.length > (mode === "compare" ? 2 : 1)}
          />
        ))}

        {/* Add profile button */}
        {mode === "compare" && profiles.length < 3 && (
          <button
            onClick={addProfile}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              border: "2px dashed var(--border)",
              borderRadius: 12,
              background: "transparent",
              cursor: "pointer",
              color: "var(--primary)",
              fontSize: 14,
              fontWeight: 600,
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
              (e.currentTarget as HTMLElement).style.background = "var(--primary-light)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Add Profile (max 3)
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <Alert type="error" title="Analysis Failed" message={error} />
      )}

      {/* Submit */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={!canSubmit}
          loading={loading}
          className="flex-1"
        >
          {mode === "single" ? "Analyze Profile" : "Compare Profiles"}
          {!loading && (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </Button>

        {!canSubmit && (
          <p style={{ fontSize: 13, color: "var(--neutral-mid)" }}>
            {mode === "single"
              ? "Enter a valid profile URL or handle"
              : `Enter at least 2 valid profiles`}
          </p>
        )}
      </div>

      {/* Data source note */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          background: "var(--primary-light)",
          borderRadius: 10,
          border: "1px solid #C7D2FE",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
        </svg>
        <p style={{ fontSize: 12, color: "#4338CA" }}>
          CollabIQ analyzes <strong>publicly available</strong> Instagram &amp; LinkedIn profile data only. Private accounts cannot be analyzed.
        </p>
      </div>
    </div>
  );
};

// ── ModeCard ────────────────────────────────────────────────────────────────

const ModeCard: React.FC<{
  label: string;
  description: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, description, icon, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      padding: "14px 16px",
      border: `2px solid ${active ? "#4F46E5" : "var(--border)"}`,
      borderRadius: 12,
      background: active ? "var(--primary-light)" : "white",
      cursor: "pointer",
      textAlign: "left",
      transition: "all 0.2s",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 14,
          color: active ? "var(--primary)" : "var(--neutral-dark)",
        }}
      >
        {label}
      </span>
      {active && (
        <div
          style={{
            marginLeft: "auto",
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
    <p style={{ fontSize: 12, color: "var(--neutral-mid)" }}>{description}</p>
  </button>
);

// ── ManualInputForm ─────────────────────────────────────────────────────────

interface ManualInputFormProps {
  onSubmit: (data: ManualInputData) => void;
  loading?: boolean;
  profileCount?: number;
}

export const ManualInputForm: React.FC<ManualInputFormProps> = ({
  onSubmit,
  loading = false,
  profileCount = 1,
}) => {
  const [profiles, setProfiles] = useState<ManualInputData[]>([
    {
      handle: "",
      platform: "instagram",
      followerCount: 0,
      avgLikesPerPost: 0,
      avgCommentsPerPost: 0,
      postFrequency: 0,
      lastPostDate: "",
      bio: "",
      displayName: "",
    },
  ]);

  const updateProfile = (
    index: number,
    field: keyof ManualInputData,
    value: string | number
  ) => {
    setProfiles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const canSubmit = profiles.every(
    (p) =>
      p.handle &&
      p.followerCount > 0 &&
      p.avgLikesPerPost >= 0 &&
      p.postFrequency > 0 &&
      p.lastPostDate
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Alert
        type="info"
        title="Manual Input Mode"
        message="API data is unavailable for this profile. Please enter the metrics manually from the profile page."
      />

      {profiles.map((profile, index) => (
        <div
          key={index}
          style={{
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 20,
            background: "white",
          }}
        >
          {profileCount > 1 && (
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 15,
                color: "var(--neutral-dark)",
                marginBottom: 16,
              }}
            >
              Profile {index + 1}
            </h4>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <FormField label="Handle / Username *">
              <input
                type="text"
                value={profile.handle}
                onChange={(e) => updateProfile(index, "handle", e.target.value)}
                placeholder="@username"
                style={inputStyle}
              />
            </FormField>

            <FormField label="Platform *">
              <select
                value={profile.platform}
                onChange={(e) =>
                  updateProfile(index, "platform", e.target.value as Platform)
                }
                style={inputStyle}
              >
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </FormField>

            <FormField label="Display Name">
              <input
                type="text"
                value={profile.displayName || ""}
                onChange={(e) => updateProfile(index, "displayName", e.target.value)}
                placeholder="Full Name"
                style={inputStyle}
              />
            </FormField>

            <FormField label="Follower Count *">
              <input
                type="number"
                value={profile.followerCount || ""}
                onChange={(e) =>
                  updateProfile(index, "followerCount", parseInt(e.target.value) || 0)
                }
                placeholder="e.g. 25000"
                min="0"
                style={inputStyle}
              />
            </FormField>

            <FormField label="Avg. Likes per Post *">
              <input
                type="number"
                value={profile.avgLikesPerPost || ""}
                onChange={(e) =>
                  updateProfile(
                    index,
                    "avgLikesPerPost",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="e.g. 850"
                min="0"
                style={inputStyle}
              />
            </FormField>

            <FormField label="Avg. Comments per Post *">
              <input
                type="number"
                value={profile.avgCommentsPerPost || ""}
                onChange={(e) =>
                  updateProfile(
                    index,
                    "avgCommentsPerPost",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="e.g. 45"
                min="0"
                style={inputStyle}
              />
            </FormField>

            <FormField label="Posts per Week *">
              <input
                type="number"
                value={profile.postFrequency || ""}
                onChange={(e) =>
                  updateProfile(
                    index,
                    "postFrequency",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="e.g. 4"
                min="0"
                step="0.5"
                style={inputStyle}
              />
            </FormField>

            <FormField label="Last Post Date *">
              <input
                type="date"
                value={profile.lastPostDate}
                onChange={(e) =>
                  updateProfile(index, "lastPostDate", e.target.value)
                }
                style={inputStyle}
              />
            </FormField>

            <FormField label="Bio (optional)" fullWidth>
              <textarea
                value={profile.bio || ""}
                onChange={(e) => updateProfile(index, "bio", e.target.value)}
                placeholder="Profile bio text..."
                rows={2}
                style={{ ...inputStyle, resize: "vertical", height: "auto", padding: "10px 14px" }}
              />
            </FormField>
          </div>
        </div>
      ))}

      <Button
        variant="primary"
        size="lg"
        onClick={() => onSubmit(profiles[0])}
        disabled={!canSubmit}
        loading={loading}
      >
        Run Analysis
      </Button>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid var(--border)",
  borderRadius: 10,
  fontSize: 14,
  color: "var(--neutral-dark)",
  background: "white",
  outline: "none",
  fontFamily: "var(--font-body)",
  transition: "border-color 0.15s",
};

const FormField: React.FC<{
  label: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}> = ({ label, children, fullWidth = false }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: fullWidth ? "1 / -1" : undefined }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--neutral-mid)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {label}
    </label>
    {children}
  </div>
);
