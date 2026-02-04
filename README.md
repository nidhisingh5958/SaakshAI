# SaakshAI - Misinformation Intelligence Engine

A professional-grade **Misinformation Intelligence Engine** built with React and TypeScript. SaakshAI detects fake news, misinformation, and linguistic manipulation in multilingual content using advanced AI models.

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.4-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue)

---

## 🎯 Project Overview

SaakshAI analyzes text content to identify misinformation, manipulation tactics, and viral risk factors using:
- **Google Gemini AI** (primary) or **Groq API** (fallback) for intelligent analysis
- **Advanced linguistic detection** for clickbait, sensationalism, and fear-mongering
- **Emotional tone analysis** (anger, fear, urgency, neutrality, joy)
- **Credibility scoring** and fake content risk assessment
- **Virality prediction** with impact analysis
- **Multi-language support** for global content analysis

---

## 🚀 Key Features

### 1. **Content Analysis**
- User input text for misinformation analysis
- Real-time processing with status tracking
- Error handling and user feedback

### 2. **Reddit Narrative Intelligence Module** 🆕
Real-time social media monitoring and misinformation detection on Reddit:

#### **Subreddit Monitoring**
- Monitor any subreddit for misinformation patterns
- Search by keyword across Reddit or within specific subreddits
- Fetch latest and trending posts with configurable limits

#### **Thread Analysis**
- Automatically fetches top comments for each post
- Combines post content and comments for comprehensive analysis
- Preprocesses text (removes markdown, strips URLs, normalizes whitespace)

#### **SaakshAI Engine Integration**
- Full misinformation analysis on Reddit content
- All standard metrics: credibility, fake risk, threat level, linguistic risks
- Emotional tone detection on social discussions
- Virality prediction for Reddit posts

#### **Narrative Risk Detection**
- Detects emerging misinformation clusters
- Identifies when multiple high-risk posts appear in the same subreddit
- Flags coordinated narrative campaigns
- Shows "High-Risk Narrative" alerts when patterns are detected

#### **Batch Processing & Performance**
- Analyzes multiple posts efficiently (5 posts at a time)
- Built-in caching (5-minute TTL) to avoid reanalyzing
- Rate limiting and retry logic for API stability
- Progress tracking during analysis

#### **Interactive UI**
- **Input Panel**: Enter subreddit name or search keywords
- **Post Risk Table**: Sortable table showing all analyzed posts with risk scores
- **Narrative Alert Banner**: Visual warning when narrative clusters detected
- **Post Detail Modal**: Deep dive into any post with:
  - Full emotional radar chart
  - Linguistic risk breakdown
  - Top comments display
  - Direct link to Reddit post

### 3. **AI-Powered Detection**
- Dual API support (Gemini + Groq for reliability)
- **Caching system** (5-minute TTL, max 100 entries)
- **Batch processing** for efficient API calls
- **Retry logic** (max 3 retries with exponential backoff)
- Structured JSON schema for consistent responses

### 4. **Comprehensive Analysis Results**

Returns detailed metrics:
- **Credibility Score** (0-100%): Overall content trustworthiness
- **Fake Risk Score** (0-100%): Probability of false information
- **Threat Level**: low | medium | high | critical
- **Linguistic Risks**: Detects 5 manipulation types:
  - Clickbait
  - Sensationalism
  - Fear-mongering
  - Vague claims
  - Authority misuse
- **Emotional Tone**: Quantifies anger, fear, urgency, neutrality, joy
- **Virality Risk**: Predicts viral potential and impact
- **Claim Breakdown**: Verdict (verified/unverified/refuted) for each claim
- **News Relevance**: Topic match with trusted sources
- **Highlighted Text**: Marks suspicious, verified, and neutral segments

### 5. **Interactive Dashboard**
- **Score Cards**: Visual representation of credibility, fake risk, virality, threat level
- **Radar Chart**: Emotional tone analysis visualization
- **Bar Charts**: Linguistic risks and claim verdicts
- **Content Highlighting**: Color-coded suspicious/verified text
- **Claims Section**: Detailed breakdown with source relevance
- **Top Sources**: List of trusted sources matching the topic
- **Responsive Design**: Mobile-friendly layout

---

## 🛠️ Technology Stack

**Frontend:**
- React 19.2.4
- TypeScript 5.8.2
- Vite 6.2.0 (build tool)
- Tailwind CSS (styling)
- Recharts 3.7.0 (data visualization)
- Lucide React 0.563.0 (icons)

**Backend/AI:**
- Google GenAI SDK 1.38.0
- Groq SDK 0.8.0

---

## 📁 Project Structure

```
/
├── App.tsx                      # Main application component with tab navigation
├── index.tsx                    # React entry point
├── index.html                   # HTML template
├── types.ts                     # TypeScript interfaces (includes Reddit types)
├── metadata.json                # Project metadata
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts              # Vite configuration
├── components/
│   ├── Dashboard.tsx            # Results visualization dashboard
│   └── RedditMonitor.tsx        # Reddit monitoring interface
└── services/
    ├── geminiService.ts         # AI analysis service
    └── redditService.ts         # Reddit API integration service
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js installed
- Gemini API Key (get it from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Set API Key
# Create .env.local file in root and add:
# GEMINI_API_KEY=your_gemini_api_key_here

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

### Using the Reddit Monitor

1. Click on the **"Reddit Monitor"** tab in the navigation
2. Enter either:
   - **Subreddit name** (e.g., `technology`, `worldnews`) - without the "r/"
   - **Keyword** (e.g., `vaccine`, `crypto`, `AI`)
   - Or **both** to search within a specific subreddit
3. Click **"Start Monitoring"**
4. Wait for posts to be fetched and analyzed
5. Review the **Post Risk Table** sorted by fake risk score
6. Click any post to see detailed analysis
7. Watch for **Narrative Alert Banners** indicating coordinated misinformation

**Note**: The Reddit integration uses Reddit's public JSON API (no OAuth required), so no Reddit API credentials are needed.

---

## 📊 Data Flow

### **Standard Analysis Flow**
```
User Input Text
      ↓
analyzeContent() → Check Cache
      ↓ (if not cached)
Google Gemini/Groq API
      ↓
Parse & Validate Response
      ↓
Cache Result
      ↓
Return AnalysisResult
      ↓
Dashboard Visualization
```

### **Reddit Monitoring Flow** 🆕
```
User Input (Subreddit/Keyword)
      ↓
fetchSubredditPosts() or searchRedditPosts()
      ↓
Reddit JSON API (no auth required)
      ↓
For each post → fetchPostComments()
      ↓
preprocessText() → Remove markdown, URLs, normalize
      ↓
analyzeBatchPosts() → Process 5 at a time
      ↓
analyzeContent() → SaakshAI engine analysis
      ↓
detectNarrativeClusters() → Find coordinated campaigns
      ↓
Cache results (5-min TTL per post)
      ↓
RedditMonitor UI Display (5 posts per batch)
- **Retry Mechanism**: Ensures reliability with exponential backoff
- **Lazy Evaluation**: Only processes when user submits analysis
- **Rate Limiting**: 2-second minimum interval between Reddit API requests
- **Reddit Cache**: Separate cache for Reddit analyses (50 entry limit)
- **Comment Limiting**: Fetches only top 20 comments to avoid token overflow
---

## 🔧 Core Types

### **AnalysisResult**
Main output structure containing all analysis metrics

### **LinguisticIndicator**
Detected manipulation techniques with severity

### **ClaimBreakdown**
Individual fact-check analysis


### **Reddit Types** 🆕

#### **RedditPost**
Raw Reddit post data from API including title, content, score, comments count

#### **RedditComment**
Comment data with author, body, score, and timestamp

#### **RedditAnalysisResult**
Complete analysis of a Reddit post including:
- All standard SaakshAI metrics
- Top comments analyzed
- Post metadata (subreddit, URL, timestamp)
- Narrative cluster ID (if part of a coordinated campaign)

#### **NarrativeCluster**
Detected misinformation narrative patterns across multiple posts:
- Cluster ID and theme
- List of post IDs involved
- Average fake risk and threat level
- Detection timestamp

#### **RedditMonitorStatus**
Reddit monitor state: `idle` | `fetching` | `analyzing` | `completed` | `error`
### **AnalysisStatus**
Processing state: `idle` | `processing` | `completed` | `error`

---

## ⚡ Performance Optimizations

- **Intelligent Caching**: 5-minute TTL prevents redundant API calls
- **Batch Processing**: Groups requests for efficiency
- **Retry Mechanism**: Ensures reliability with exponential backoff
- **Lazy Evaluation**: Only processes when user submits analysis

---

## 🎨 UI/UX Features

- Modern dark theme with blue/indigo accent colors
- Smooth animations and transitions
- Real-time status indicators (pulsing "Systems Online" badge)
- Responsive grid layouts
- Interactive hover effects on cards
- Icon-based visual communication

---

## 📄 License

Apache License - feel free to use this project for your own purposes.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 📧 Contact

For questions or feedback, please open an issue on the repository.