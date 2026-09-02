/**
 * SaakshAI Investigative Journalism Visual System Tokens
 * Digital Investigative Newsroom & Editorial Research Desk aesthetic.
 */

export const COLOR_TOKENS = {
  // Base Newsroom Palette
  background: "#F5F1E8",        // Warm off-white newsprint canvas
  surfacePrimary: "#FFFDF8",    // Paper / document surface
  surfaceSecondary: "#EFE8DA",  // Subtle parchment container
  surfaceDark: "#161614",       // Deep warm editorial charcoal for dark sections
  surfaceDarkGreen: "#1D211C",  // Dark green editorial accent surface

  // Typography
  textPrimary: "#11110F",      // Charcoal ink primary text
  textSecondary: "#625E55",    // Warm taupe body copy & secondary text
  textMuted: "#8C877C",        // Muted lead caption text
  textLight: "#F5F1E8",        // Light parchment text on dark sections

  // Investigative Accents
  primaryGreen: "#2E7D50",     // Investigative newsroom green
  darkGreen: "#1E4D37",        // Dark green accent
  warmRust: "#A65A43",         // Archival rust accent
  warningAmber: "#B0783C",     // Warm amber caution

  // Semantic Risk & Verification
  verified: "#2E7D50",         // Verified / Low risk
  suspicious: "#B0783C",       // Watch / Suspicious
  highRisk: "#A83F3F",         // High risk / Crimson threat

  // Hairline Rules & Dividers
  borderSubtle: "#E5DEC3",
  borderModerate: "#D8D1C4",    // Hairline newsprint divider rule
  borderDark: "rgba(255, 255, 255, 0.12)",
} as const;

export const TYPOGRAPHY_TOKENS = {
  fontFamilySans: "'Inter', system-ui, -apple-system, sans-serif",
  fontFamilySerif: "'Playfair Display', Georgia, serif",
  fontFamilyMono: "'JetBrains Mono', monospace",
  
  displayHero: {
    fontSize: "clamp(3.5rem, 7vw, 7rem)", // 56px to 112px
    lineHeight: "1.02",
    fontWeight: "700",
    letterSpacing: "-0.03em",
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  displayStatement: {
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)", // 40px to 72px
    lineHeight: "1.08",
    fontWeight: "700",
    letterSpacing: "-0.025em",
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  sectionHeading: {
    fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", // 28px to 44px
    lineHeight: "1.15",
    fontWeight: "700",
    letterSpacing: "-0.02em",
  },
  subHeading: {
    fontSize: "1.25rem", // 20px
    lineHeight: "1.35",
    fontWeight: "600",
    letterSpacing: "-0.01em",
  },
  body: {
    fontSize: "1.0625rem", // 17px
    lineHeight: "1.65",
    fontWeight: "400",
  },
  bodySecondary: {
    fontSize: "0.9375rem", // 15px
    lineHeight: "1.6",
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
  pageMarginDesktop: "4rem",  // 64px
  pageMarginMobile: "1.25rem",// 20px
  sectionGap: "5rem",         // 80px
  gridGap: "2rem",            // 32px
} as const;

export const RADIUS_TOKENS = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "16px",
} as const;
