/**
 * SaakshAI HopeRise-Inspired Editorial Human-Centered Tokens
 */

export const COLOR_TOKENS = {
  // Primary Palette
  background: "#F4EBDD",        // Warm parchment / cream
  surfacePrimary: "#FFFDF9",    // Elevated white paper surface
  surfaceSecondary: "#EED4AC",  // Soft peach container / highlight
  surfaceInteractive: "#E3D5C0",// Active / hover state
  surfaceDark: "#181614",       // Deep warm charcoal alternating surface

  // Typography
  textPrimary: "#0D0B09",      // Almost-black warm charcoal
  textSecondary: "#5A4434",    // Warm brown body text
  textMuted: "#B9A78D",        // Muted sand caption text
  textLight: "#F4EBDD",        // Light text on dark surfaces

  // Accents
  primaryGreen: "#2EA334",     // Primary action green
  warmGold: "#B19C7A",         // Warm gold metadata & accent
  softPeach: "#EED4AC",        // Soft peach highlight

  // Semantic Risk
  verified: "#2EA334",         // Verified / Low risk / Natural green
  suspicious: "#B19C7A",       // Watch / Suspicious / Warm gold
  highRisk: "#B94A48",         // High risk / Critical threat / Crimson

  // Borders
  borderSubtle: "#E3D5C0",
  borderModerate: "#B19C7A",
  borderDark: "rgba(255, 255, 255, 0.12)",
} as const;

export const TYPOGRAPHY_TOKENS = {
  fontFamilySans: "'Inter', system-ui, -apple-system, sans-serif",
  fontFamilySerif: "'Playfair Display', Georgia, serif",
  fontFamilyMono: "'JetBrains Mono', monospace",
  
  displaySerif: {
    fontSize: "3.25rem", // 52px
    lineHeight: "1.1",
    fontWeight: "700",
    letterSpacing: "-0.02em",
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  pageHeader: {
    fontSize: "2.25rem", // 36px
    lineHeight: "1.2",
    fontWeight: "700",
    letterSpacing: "-0.02em",
  },
  sectionHeader: {
    fontSize: "1.5rem", // 24px
    lineHeight: "1.3",
    fontWeight: "600",
    letterSpacing: "-0.01em",
  },
  body: {
    fontSize: "0.9375rem", // 15px
    lineHeight: "1.65",
    fontWeight: "400",
  },
  bodySecondary: {
    fontSize: "0.875rem", // 14px
    lineHeight: "1.55",
    fontWeight: "400",
  },
  labelMeta: {
    fontSize: "0.75rem", // 12px
    lineHeight: "1.4",
    fontWeight: "500",
    fontFamily: "'JetBrains Mono', monospace",
  },
} as const;

export const SPACING_TOKENS = {
  pageMarginDesktop: "3.5rem", // 56px
  pageMarginMobile: "1.25rem",// 20px
  sectionGap: "4rem",         // 64px
  componentPadding: "2rem",   // 32px
  gridGap: "1.5rem",          // 24px
} as const;

export const RADIUS_TOKENS = {
  sm: "8px",
  md: "14px",
  lg: "20px",
  full: "9999px",
} as const;
