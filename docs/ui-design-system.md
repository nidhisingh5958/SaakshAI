# SaakshAI — UI Audit & Design System Specifications (Phase 1)

## 1. Existing UI Architecture Summary

### Application Architecture & Tech Stack
* **Framework**: React 19 (`react`, `react-dom`) with Vite 6 build tooling and TypeScript 5.8.
* **Styling Infrastructure**: Tailwind CSS loaded via CDN script in `index.html` paired with inline CSS utility classes and keyframe definitions.
* **Component Architecture**: Single-page application architecture with state-driven view toggling inside `App.tsx`.
  * **Main Entry Point**: `index.tsx` mounting `App.tsx` into DOM `#root`.
  * **Global Layout**: `App.tsx` containing Navigation Header, Main Workspace Container, View Switcher, and Footer.
  * **Page Views**:
    1. **Intelligence Analysis** (`App.tsx` + `Dashboard.tsx`): Content input, processing state, credibility scores, linguistic analysis, claim breakdown, emotional radar, virality forecast, and news RAG summary.
    2. **Reddit Monitor** (`components/RedditMonitor.tsx`): Subreddit/Keyword query input, batch fetching, progress indicator, threat narrative alerts, post matrix, radar chart, and modal inspector.
    3. **YouTube Monitor** (`components/YouTubeMonitor.tsx`): Topic query input, video statistics, batch processing, narrative trend alerts, video table, radar chart, comment risk breakdown, and modal inspector.
* **External Libraries & Icons**:
  * `lucide-react` (20+ icons utilized across navigation, headers, metrics, and indicators)
  * `recharts` (`RadarChart`, `BarChart`, `ResponsiveContainer`, `PolarGrid`, `PolarAngleAxis`, `PolarRadiusAxis`)
  * `@google/genai` (Gemini 3 Pro / Flash integration)
  * `groq-sdk` (Llama 3.3 70B fallback model integration)

### Data Flow Architecture
```
[User Input: Text / URL / Query]
             │
             ▼
[App.tsx / Sub-Monitors State]
             │
             ▼
[Service Layer: geminiService / redditService / youtubeService]
   ├── Client-Side Caching (5 min TTL Map)
   ├── Rate Limiting & Retry Mechanism (Exponential Backoff)
   ├── Primary API: Gemini 3 Pro (Structured JSON Schema)
   └── Fallback API: Groq Llama-3.3-70B (Structured JSON Output)
             │
             ▼
[Structured Response (AnalysisResult / RedditAnalysisResult / YouTubeAnalysisResult)]
             │
             ▼
[UI View Components (Dashboard.tsx / RedditMonitor.tsx / YouTubeMonitor.tsx)]
```

---

## 2. Functional Preservation Matrix

The following core logic must remain completely isolated from presentation refactoring:

| Domain | Functional Logic Component | File Location | Key Invariants / Contracts |
|---|---|---|---|
| **AI Inference** | `analyzeContentInternal` | `services/geminiService.ts` | Gemini 3 model calls with schema validation; fallback to Groq Llama-3.3-70B on rate limit/quota error. |
| **API Caching & Batching** | `cache`, `batchQueue`, `executeWithRetry` | `services/geminiService.ts` | 5-minute TTL memory cache, 200ms batch delay, max batch size 5, exponential backoff on HTTP 429. |
| **Reddit Data Mining** | `fetchSubredditPosts`, `searchRedditPosts`, `fetchPostComments` | `services/redditService.ts` | Unauthenticated Reddit JSON API endpoints (`/r/{sub}/hot.json`, `/search.json`), client-side text pre-processing, rate limiting (2000ms interval). |
| **YouTube Data Mining** | `searchYouTubeVideos`, `fetchVideoComments` | `services/youtubeService.ts` | YouTube Data API v3 calls, video detail batching, comment thread retrieval, quota handling. |
| **Clustering Algorithms** | `detectNarrativeClusters` | `services/redditService.ts`, `services/youtubeService.ts` | Multi-post/video risk thresholding, average threat calculation, cluster group assembly. |
| **Risk Scoring & Metrics** | `credibilityScore`, `fakeRiskScore`, `threatLevel`, `viralityRisk` | `types.ts` | Standardized 0–100 numerical range, 4-tier threat classification (`low`, `medium`, `high`, `critical`). |
| **Text Highlighting** | `highlightedText` | `types.ts`, `components/Dashboard.tsx` | Full input text reconstruction using annotated token segments (`suspicious`, `verified`, `neutral`) with tooltips. |

---

## 3. Comprehensive Frontend Audit & UI Problems

### Existing Visual Deficiencies
1. **Excessive Glassmorphism & Background Noise**:
   - Pervasive use of `backdrop-blur-xl`, `bg-slate-900/70`, floating animated background orbs (`orb-1`, `orb-2`, `orb-3` in `index.html`), creating visual clutter and distracting motion.
2. **Overused Card Containers & Boxiness**:
   - Every metric, chart, claim, and input field is wrapped in heavily bordered `bg-slate-800/60` rounded cards with drop shadows (`shadow-2xl`, `shadow-xl`), causing visual fatigue.
3. **Hyper-Saturated Gradients & Neon Glows**:
   - Glowing blue/purple/emerald blurred highlights behind icons (`glow-blue`, `glow-purple`, `bg-blue-500 rounded-xl blur-lg`), giving the app a gaming/crypto dashboard aesthetic rather than an investigative research platform.
4. **Weak Typographic Hierarchy**:
   - Reliance on single weight variations of sans-serif Inter with saturated gradient clips (`text-transparent bg-clip-text`). Lack of editorial scale contrast, distinct section numbering, or refined serif/mono typographic pairings.
5. **Centered & Uniform Dashboard Grid Layouts**:
   - Static 4-column metric grids (`grid-cols-4`) with repetitive icon-over-number arrangements that lack narrative pacing or analytical focal points.
6. **Inconsistent Border Radius & Spacing Tokens**:
   - Random mixture of `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `p-4`, `p-5`, `p-6`, `gap-3`, `gap-4`, `gap-6` without systemized spacing mathematical steps.
7. **Redundant & Scattered Custom Styles**:
   - CSS rules defined inside raw `<style>` blocks in `index.html` and inline `<style>` tags in `App.tsx` alongside Tailwind CDN scripts.
8. **Weak Empty, Loading, and Error States**:
   - Processing state relies on spinning glowing rings (`animate-spin`, `animate-ping`) and rainbow progress gradients. Empty states use generic dashed boxes without analytical context or guidance.

---

## 4. New Design Direction (Ramos-Inspired Editorial Intelligence Platform)

### Philosophy: Precision Editorial & Analytical Rigor
The updated visual identity transforms SaakshAI into an **Investigative Misinformation Intelligence Terminal**. Inspired by high-end analytical reporting and editorial UI layout design (e.g. Ramos):

* **Editorial Typography**: Large, clear display headers, high-contrast metric callouts, and clean data tables with crisp monospace metadata.
* **Spacious Composition**: Asymmetrical layouts with generous negative space, replacing cramped grid boxes with clear visual grouping.
* **Flat Architectural Surfaces**: Muted dark obsidian planes with razor-thin hairline dividers (`1px` subtle borders) rather than heavy glossy glass cards and drop shadows.
* **Quiet Motion**: Purposeful, high-framerate subtle entrances (fade/slide opacity transforms) without heavy bouncing, glowing pulses, or continuous looping background orbs.
* **Semantic Precision**: Standardized color tokens where accents strictly communicate intelligence severity (Verified vs Suspicious vs High Risk).

---

## 5. Centralized Design System Tokens

### Base Color System

```typescript
export const COLOR_TOKENS = {
  // Core Background & Surfaces
  background: "#080B14",       // Base canvas background
  surfacePrimary: "#0E1320",   // Primary structural container surface
  surfaceSecondary: "#121827", // Secondary elevated card/panel surface
  surfaceInteractive: "#182033",// Hover / active element surface

  // Typography Tokens
  textPrimary: "#F4F5F8",     // High contrast main text & headings
  textSecondary: "#8992A7",   // Secondary descriptive copy
  textMuted: "#5F687C",       // Captions, metadata, & disabled labels

  // Intelligence Accent System
  intelligenceBlue: "#5B8CFF",// Primary brand & active navigation state
  intelligenceViolet: "#9B6DFF",// AI model highlights & narrative clusters
  cyan: "#38D9FF",            // RAG verification & network telemetry

  // Semantic Risk System
  verified: "#35D49A",        // Verified facts & high credibility (Low Risk)
  suspicious: "#FFB84D",      // Unverified claims & moderate risk (Medium Risk)
  highRisk: "#FF5F6D",        // Refuted content, clickbait & critical threat (High Risk)

  // System Borders & Dividers
  borderSubtle: "rgba(255, 255, 255, 0.06)",
  borderModerate: "rgba(255, 255, 255, 0.12)",
  borderActive: "rgba(91, 140, 255, 0.35)",
} as const;
```

---

## 6. Typography System

| Level | Font Family | Size | Weight | Tracking | Line Height | Usage |
|---|---|---|---|---|---|---|
| **Display Heading** | Inter / System | 56px - 64px | 800 | `-0.03em` | 1.05 | Landing page primary editorial hero titles |
| **Page Heading** | Inter / System | 36px - 40px | 700 | `-0.02em` | 1.15 | Main view headers (Intelligence, Reddit, YouTube) |
| **Section Heading** | Inter / System | 24px - 28px | 600 | `-0.015em` | 1.25 | Major analytical module headers |
| **Subsection Heading**| Inter / System | 18px - 20px | 600 | `-0.01em` | 1.35 | Sub-cards, claim titles, video items |
| **Body** | Inter / System | 15px - 16px | 400 | `0` | 1.6 | Primary article copy, claim descriptions, explanations |
| **Secondary Body** | Inter / System | 13px - 14px | 400 | `0` | 1.5 | Secondary notes, tooltips, comment text |
| **Numeric Metric** | JetBrains Mono | 32px - 48px | 700 | `-0.02em` | 1.0 | Score percentages, count numbers |
| **Labels / Meta** | JetBrains Mono | 11px - 12px | 500 | `+0.05em` | 1.4 | Badges, language tags, source metadata (UPPERCASE) |

---

## 7. Spacing & Layout System

```
Page Outer Margin:      Desktop: 48px (px-12) | Mobile: 20px (px-5)
Max Container Width:    1280px (max-w-7xl)
Section Vertical Gap:   48px - 64px (space-y-12 to space-y-16)
Component Inner Padding: 24px - 32px (p-6 to p-8)
Grid Columns Gap:       24px (gap-6)
Border Radius Tokens:   sm: 6px | md: 10px | lg: 16px | xl: 24px
```

---

## 8. Surface System

1. **Page Canvas Background**: `#080B14` flat dark canvas without floating colored blur orbs.
2. **Subtle Structural Surface**: `#0E1320` with hairline border `rgba(255,255,255,0.06)`. Used for major section containers.
3. **Elevated Analytical Surface**: `#121827` with hairline border `rgba(255,255,255,0.08)`. Used for claim items, post rows, and metrics.
4. **Interactive Focus Surface**: `#182033` with subtle stroke highlight `#5B8CFF`. Used for hover states and active form controls.

---

## 9. Motion System

* **Entrance Animations**: Subtle vertical fade-in (`opacity: 0 -> 1`, `translateY: 8px -> 0px`, duration: `240ms`, easing: `cubic-bezier(0.16, 1, 0.3, 1)`).
* **Hover Transitions**: Color and border opacity transitions over `150ms ease-out` without 3D card tilt or heavy scaling (`scale(1.02)` removed).
* **Data Visualization Transitions**: Graph path drawing and progress bars transition smoothly over `600ms cubic-bezier(0.4, 0, 0.2, 1)`.
* **Accessibility**: All keyframe animations wrapped under `@media (prefers-reduced-motion: reduce)` to disable layout motion when requested by the OS.

---

## 10. Reusable Component Architectural Plan

To maintain modularity in Phase 2, the following reusable primitives will be established under `src/components/ui/`:

```
src/components/ui/
├── AppShell.tsx           # Outer framework layout & navigation bar
├── Navigation.tsx         # Header tab switcher & platform status
├── PageHeader.tsx         # Editorial view title block & actions
├── Section.tsx            # Standardized layout section wrapper
├── SectionLabel.tsx       # Monospace uppercase section indicator tag
├── EditorialHeading.tsx   # High-contrast display typography header
├── IntelligenceMetric.tsx  # Editorial metric callout block with numerical score
├── SignalBar.tsx          # Clean linear metric indicator bar
├── RiskIndicator.tsx      # Semantic badge (Verified / Suspicious / High Risk)
├── AnalysisInput.tsx      # Primary editorial text input terminal
├── AnalysisProgress.tsx   # High-precision linear loader step tracker
├── ClaimBlock.tsx         # Fact-checking claim verification row
├── EvidenceBlock.tsx      # RAG consensus summary & source badge list
├── MonitorPanel.tsx       # Structured table panel for Reddit & YouTube
├── EmptyState.tsx         # Technical empty state with guidance
├── LoadingState.tsx       # Clean subtle loading skeleton container
├── ErrorState.tsx         # Precise inline & modal error alert block
└── Footer.tsx             # Clean platform metadata footer
```

---

## 11. Component Refactoring & Replacement Matrix

| Existing Component | Current State | Refactoring Plan | Action |
|---|---|---|---|
| `App.tsx` Navbar | Glossy glass backdrop blur with glowing blue logo orb. | Convert to clean flat surface `#0E1320` with hairline bottom border, subtle status pill, and typography logo. | **Refactor** |
| `App.tsx` Input Section | Centered heroic text, animated gradients, floating textarea glow. | Refactor into asymmetric editorial layout: strong left display title, clean right textarea container in `#0E1320`. | **Refactor** |
| `App.tsx` Processing State | Multi-colored concentric spinning rings with pulse glow. | Replace with minimalist linear telemetry step tracker using monospace status indicators. | **Replace** |
| `Dashboard.tsx` Top Stats | 4 rounded gradient cards with top-right glowing circles and large icons. | Replace with clean `IntelligenceMetric` blocks featuring sharp mono numbers and crisp semantic risk bars. | **Replace** |
| `Dashboard.tsx` Highlighted Text | Colored background highlights with hover title tooltips. | Retain exact token replacement logic, update inline highlight styles to subtle semantic underlines & background tints. | **Refactor** |
| `Dashboard.tsx` Fact Check Claims | Stacked dark cards with check/cross icons. | Standardize into clean `ClaimBlock` list with crisp verdict badges (`Verified`, `Refuted`, `Unverified`). | **Refactor** |
| `Dashboard.tsx` Emotional Radar | Recharts RadarChart with standard purple stroke and gradient fill. | Retain Recharts container, update color palette to `#9B6DFF` with subtle grid lines matching `#121827` theme. | **Refactor** |
| `RedditMonitor.tsx` Form & Table | Gradient containers, purple buttons, dense table layout. | Update input fields to sharp design system tokens, streamline table into clean `MonitorPanel` with mono metrics. | **Refactor** |
| `YouTubeMonitor.tsx` Video Cards | High-contrast cards with glowing thumbnail overlays and multi-color tags. | Refactor into clean editorial video analysis list with monospace view counts and precise risk indicator pills. | **Refactor** |

---

## 12. Technical Risks & Mitigation Strategies

1. **Tailwind CDN Limitations**:
   * *Risk*: Current setup imports Tailwind via CDN script tag in `index.html`. Custom theme extensions (e.g. exact hex color utilities) can become messy without a compiled Tailwind config.
   * *Mitigation*: Create `src/design-system/tokens.ts` containing typed constants and CSS custom properties in `src/index.css` or `index.html` to guarantee strict color enforcement.
2. **Recharts Theme Overrides**:
   * *Risk*: Default Recharts SVG elements use hardcoded colors (`#334155`, `#8b5cf6`) that may clash with the new color tokens if not passed dynamically.
   * *Mitigation*: Map Design System color constants directly into Recharts SVG props (`stroke`, `fill`, `tick`).
3. **Data Contract Drift**:
   * *Risk*: Visual refactoring could accidentally drop payload properties (e.g., `foundPhrases`, `summaryOfVerifiedFacts`, `highlightedText` tooltips).
   * *Mitigation*: Enforce TypeScript props validation against existing interfaces in `types.ts` without modifying schema definitions.
