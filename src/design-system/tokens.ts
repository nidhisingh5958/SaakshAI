/**
 * SaakshAI Centralized Design System Tokens
 * Derived from the Ramos-inspired Editorial Intelligence & Investigative Terminal visual philosophy.
 */

export const COLOR_TOKENS = {
  // Canvas & Structural Surfaces
  background: "#080B14",        // Base dark background canvas
  surfacePrimary: "#0E1320",    // Primary structural surface
  surfaceSecondary: "#121827",  // Elevated card & section surface
  surfaceInteractive: "#182033",// Active / Hover surface

  // Typography Colors
  textPrimary: "#F4F5F8",      // High-contrast primary text & headings
  textSecondary: "#8992A7",    // Secondary body text & explanations
  textMuted: "#5F687C",        // Metadata, labels, captions & disabled elements

  // Intelligence Brand & Feature Accents
  intelligenceBlue: "#5B8CFF", // Primary brand accent & active states
  intelligenceViolet: "#9B6DFF",// AI model highlights & narrative clusters
  cyan: "#38D9FF",             // RAG news consensus & telemetry metrics

  // Semantic Risk & Verification Colors
  verified: "#35D49A",         // High credibility / Low risk / Verified claims
  suspicious: "#FFB84D",       // Moderate risk / Unverified claims / Caution
  highRisk: "#FF5F6D",         // High risk / Critical threat / Refuted claims

  // Hairline Borders & Dividers
  borderSubtle: "rgba(255, 255, 255, 0.06)",
  borderModerate: "rgba(255, 255, 255, 0.12)",
  borderActive: "rgba(91, 140, 255, 0.35)",
} as const;

export const TYPOGRAPHY_TOKENS = {
  fontFamilySans: "'Inter', system-ui, -apple-system, sans-serif",
  fontFamilyMono: "'JetBrains Mono', monospace",
  
  display: {
    fontSize: "3.5rem", // 56px
    lineHeight: "1.05",
    fontWeight: "800",
    letterSpacing: "-0.03em",
  },
  pageHeader: {
    fontSize: "2.25rem", // 36px
    lineHeight: "1.15",
    fontWeight: "700",
    letterSpacing: "-0.02em",
  },
  sectionHeader: {
    fontSize: "1.5rem", // 24px
    lineHeight: "1.25",
    fontWeight: "600",
    letterSpacing: "-0.015em",
  },
  subSectionHeader: {
    fontSize: "1.125rem", // 18px
    lineHeight: "1.35",
    fontWeight: "600",
    letterSpacing: "-0.01em",
  },
  body: {
    fontSize: "0.9375rem", // 15px
    lineHeight: "1.6",
    fontWeight: "400",
    letterSpacing: "0",
  },
  bodySecondary: {
    fontSize: "0.84375rem", // 13.5px
    lineHeight: "1.5",
    fontWeight: "400",
    letterSpacing: "0",
  },
  metricLarge: {
    fontSize: "2.5rem", // 40px
    lineHeight: "1.0",
    fontWeight: "700",
    letterSpacing: "-0.02em",
    fontFamily: "'JetBrains Mono', monospace",
  },
  labelMeta: {
    fontSize: "0.75rem", // 12px
    lineHeight: "1.4",
    fontWeight: "500",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    fontFamily: "'JetBrains Mono', monospace",
  },
} as const;

export const SPACING_TOKENS = {
  pageMarginDesktop: "3rem",  // 48px
  pageMarginMobile: "1.25rem",// 20px
  sectionGap: "3.5rem",       // 56px
  componentPadding: "1.75rem",// 28px
  gridGap: "1.5rem",          // 24px
} as const;

export const RADIUS_TOKENS = {
  sm: "6px",
  md: "10px",
  lg: "16px",
  xl: "24px",
} as const;

export const SHADOW_TOKENS = {
  none: "none",
  subtle: "0 4px 20px rgba(0, 0, 0, 0.25)",
  elevated: "0 12px 32px rgba(0, 0, 0, 0.4)",
} as const;
