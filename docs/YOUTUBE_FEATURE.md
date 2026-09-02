# YouTube Misinformation Monitoring Module

## 🎯 Overview

The **YouTube Misinformation Monitoring Module** is a powerful side feature integrated into SaakshAI that extends the platform's intelligence capabilities to video content. It uses the YouTube Data API v3 to fetch video metadata and comments, then analyzes the content using SaakshAI's misinformation detection engine to identify:

- **Misinformation patterns** in video titles and descriptions
- **Emotional manipulation** tactics in content
- **Viral deception patterns** across multiple videos
- **Coordinated narratives** forming across the platform

---

## 🚀 Quick Start

### Prerequisites

1. **YouTube Data API Key** - Required to access YouTube's public API
2. **SaakshAI Setup** - Core SaakshAI platform running
3. **Environment Configuration** - API key properly configured

### Getting Your YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**
4. Navigate to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

### Configuration

Add your YouTube API key to the environment:

```bash
# Create or edit .env file
echo "VITE_YOUTUBE_API_KEY=your_api_key_here" > .env
```

Or set it in Vite configuration:

```typescript
// vite.config.ts
export default defineConfig({
  // ... other config
  define: {
    'import.meta.env.VITE_YOUTUBE_API_KEY': JSON.stringify('your_api_key_here')
  }
})
```

⚠️ **Important**: Keep your API key secure and never commit it to version control!

---

## 📋 Features

### 1. **Video Search Monitoring**

Search for videos by keyword or topic:
- Fetches top videos by relevance, date, or view count
- Extracts title, description, channel, views, and comments
- Supports up to 50 results per search

### 2. **Comment Intelligence**

For each video:
- Fetches top comments (configurable, default 20-50)
- Analyzes sentiment and manipulation patterns
- Detects emotional escalation
- Identifies coordinated narratives

### 3. **SaakshAI Engine Integration**

Combines video metadata and comments to generate:
- **Credibility Score** (0-100)
- **Fake Risk Score** (0-100)
- **Threat Level** (low, medium, high, critical)
- **Linguistic Risks** (clickbait, fear-mongering, etc.)
- **Emotional Tone** (anger, fear, urgency, joy, neutrality)
- **Virality Risk** (potential for spread)

### 4. **Video Risk Flagging**

Automatic alerts when:
- Fake risk > threshold (default 70%)
- High fear/anger tone detected
- Sensational title patterns identified
- Multiple linguistic manipulation indicators present

### 5. **Narrative Pattern Detection**

If multiple videos show similar risky claims:
- Groups videos into **narrative clusters**
- Flags: *"Emerging misleading narrative across multiple videos"*
- Calculates average threat level per cluster
- Tracks theme and patterns

---

## 🎨 User Interface

### Navigation

The YouTube Monitor is accessible via the main navigation:

```
Intelligence | Reddit Monitor | YouTube Monitor
```

### Components

#### **1. Search Panel**
- Keyword/topic input field
- "Analyze Videos" button
- Real-time progress indicator
- Error handling display

#### **2. Narrative Alert Banner**
Shows when multiple videos contain similar risky patterns:
```
🚨 Potential Misinformation Trend Detected
2 narrative clusters identified across multiple videos
```

#### **3. Video Risk Table**

Displays analyzed videos with:
- **Thumbnail** with view count overlay
- **Video Title** with threat badge
- **Channel Name**, publish date, comment count
- **Scores**: Credibility, Fake Risk, Virality
- **Linguistic Risk Tags**
- **Cluster Indicator** (if part of narrative pattern)

Sortable by:
- Fake Risk (default, descending)
- Credibility
- Virality Risk
- View Count

#### **4. Video Detail Panel**

Click any video to see:
- **Risk Overview Cards**: Credibility, Fake Risk, Virality
- **Emotional Tone Radar Chart**: Visual representation of emotions
- **Linguistic Risk Indicators**: Detailed breakdown with severity
- **Top Comments** (up to 5): With author and like count
- **Suspicious Content Highlights**: Extracted suspicious phrases
- **Direct Link**: Watch on YouTube

---

## 🔧 Technical Architecture

### Data Flow

```
User Input (Keyword)
    ↓
YouTube Data API v3
    ↓
Video Metadata + Comments
    ↓
Text Preprocessing
    ↓
SaakshAI Analysis Engine
    ↓
Results + Clustering
    ↓
UI Display
```

### Key Files

```
services/
  youtubeService.ts       # YouTube API integration & analysis
components/
  YouTubeMonitor.tsx      # Main UI component
types.ts                  # YouTube-specific TypeScript types
App.tsx                   # Routing and tab integration
```

### Performance Optimizations

1. **Batch Processing**: Processes 5 videos at a time
2. **Caching**: 5-minute TTL for analysis results
3. **Rate Limiting**: 1 second between API requests
4. **Retry Logic**: 3 attempts with exponential backoff
5. **Error Handling**: Graceful degradation on API failures

---

## 🔐 API Compliance

### YouTube Terms of Service

✅ **Compliant Implementation**:
- Uses official YouTube Data API v3
- No web scraping or unofficial endpoints
- Respects API rate limits and quotas
- Does not analyze private videos
- Follows Google API Terms of Service

### API Quotas

YouTube Data API has daily quotas:
- **Default**: 10,000 units/day
- **Video Search**: ~100 units
- **Video Details**: ~1 unit per video
- **Comments**: ~1 unit per request

**Cost per analysis** (10 videos):
- Search: 100 units
- Video details: 10 units
- Comments (10 videos): 10 units
- **Total**: ~120 units

You can perform approximately **83 analyses per day** with the default quota.

### Rate Limiting

The service implements:
- 1 second minimum between requests
- Automatic retry with backoff on 429 (rate limit) errors
- Quota exceeded detection with user-friendly error messages

---

## 📊 Data Model

### YouTubeVideo
```typescript
{
  id: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  thumbnailUrl: string;
  duration: string;
  tags?: string[];
}
```

### YouTubeAnalysisResult
```typescript
{
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  topComments: YouTubeComment[];
  credibilityScore: number;        // 0-100
  fakeRiskScore: number;           // 0-100
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  linguisticRisks: LinguisticIndicator[];
  emotionalTone: { anger, fear, urgency, neutrality, joy };
  viralityRisk: { score, triggers, potentialImpact };
  narrativeClusterId?: string;
  videoUrl: string;
  highlightedText: Array<{text, type, tooltip}>;
}
```

---

## 🎯 Use Cases

### 1. **Election Monitoring**
Track misinformation about voting, candidates, or election processes:
```
Keyword: "election fraud 2024"
```

### 2. **Health Misinformation**
Identify false medical claims or miracle cures:
```
Keyword: "miracle cancer cure"
```

### 3. **Breaking News Verification**
Analyze videos claiming breaking news:
```
Keyword: "breaking news [event]"
```

### 4. **Conspiracy Theory Tracking**
Monitor conspiracy narratives:
```
Keyword: "government coverup"
```

### 5. **Product Scam Detection**
Find fraudulent product claims:
```
Keyword: "get rich quick scheme"
```

---

## 🔍 Analysis Methodology

### Text Sources Analyzed

1. **Video Title**: Primary headline/claim
2. **Video Description**: Extended information and links
3. **Top Comments**: Community reaction and manipulation

**Note**: The module analyzes **text metadata only**, not the video content itself.

### Misinformation Indicators

The analysis detects:

- **Clickbait**: Sensational titles with exaggerated claims
- **Fear-mongering**: Content designed to create panic
- **Vague Claims**: Unsubstantiated or ambiguous statements
- **Authority Misuse**: False attribution to experts
- **Sensationalism**: Emotionally charged language
- **Urgency Manipulation**: "ACT NOW" pressure tactics

### Emotional Analysis

Measures emotional tone across 5 dimensions:
- **Anger**: Aggressive or hostile language
- **Fear**: Threatening or alarming content
- **Urgency**: Time-pressure tactics
- **Joy**: Positive or uplifting language
- **Neutrality**: Objective, factual tone

### Virality Risk

Calculates spread potential based on:
- Emotional triggers
- Sensational claims
- Current engagement (views, comments)
- Linguistic manipulation patterns

---

## 🛠️ Customization

### Adjusting Analysis Parameters

```typescript
// In youtubeService.ts

// Cache TTL
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Batch size for processing
const BATCH_SIZE = 5;

// Number of comments to fetch
await fetchVideoComments(videoId, 30); // 30 comments

// Search result limit
await searchYouTubeVideos(query, 10); // 10 videos
```

### Modifying Cluster Detection

```typescript
// Minimum videos required for a cluster
detectNarrativeClusters(results, 2); // 2 videos minimum

// Risk threshold for clustering
if (result.fakeRiskScore < 40) {
  continue; // Skip videos below 40% risk
}
```

---

## 🚨 Troubleshooting

### "YouTube API key not configured"

**Solution**: Ensure `VITE_YOUTUBE_API_KEY` is set in your environment:
```bash
export VITE_YOUTUBE_API_KEY="your_key_here"
```

### "YouTube API quota exceeded"

**Solution**: 
1. Wait until quota resets (midnight Pacific Time)
2. Request quota increase from Google Cloud Console
3. Implement user-side rate limiting

### "No videos found"

**Possible causes**:
- Search term too specific
- No recent videos match the query
- Region restrictions

**Solution**: Try broader search terms

### Rate Limit Errors (429)

**Solution**: The service automatically retries with backoff. If persistent:
- Reduce search frequency
- Lower batch size
- Wait between requests

### Comments Disabled

Some videos have comments disabled. The service handles this gracefully and returns an empty comment array.

---

## 📈 Future Enhancements

### Planned Features

1. **Channel Monitoring**: Track specific YouTube channels for new uploads
2. **Transcript Analysis**: Use YouTube transcript API for deeper content analysis
3. **Trend Tracking**: Historical analysis of narrative evolution
4. **Multi-Language Support**: Analyze videos in multiple languages
5. **Export Reports**: Generate PDF/CSV reports of findings
6. **Real-time Alerts**: Webhook notifications for high-risk videos
7. **Network Analysis**: Map connections between channels spreading similar narratives

---

## 🔗 Integration with SaakshAI Ecosystem

The YouTube Monitor seamlessly integrates with:

- **Intelligence Module**: Share analysis engine
- **Reddit Monitor**: Cross-platform narrative detection
- **Dashboard**: Unified risk visualization
- **Knowledge Base**: Shared misinformation patterns

### Cross-Platform Analysis

Combine YouTube and Reddit monitoring to:
- Track how narratives spread across platforms
- Identify coordinated misinformation campaigns
- Detect amplification patterns
- Map influence networks

---

## 📚 API Reference

### searchYouTubeVideos()
```typescript
searchYouTubeVideos(
  query: string,
  maxResults: number = 10,
  order: 'relevance' | 'date' | 'viewCount' | 'rating' = 'relevance'
): Promise<YouTubeVideo[]>
```

### fetchVideoComments()
```typescript
fetchVideoComments(
  videoId: string,
  maxResults: number = 20
): Promise<YouTubeComment[]>
```

### analyzeYouTubeVideo()
```typescript
analyzeYouTubeVideo(
  video: YouTubeVideo,
  comments: YouTubeComment[]
): Promise<YouTubeAnalysisResult>
```

### analyzeBatchVideos()
```typescript
analyzeBatchVideos(
  videos: YouTubeVideo[],
  onProgress?: (completed: number, total: number) => void
): Promise<YouTubeAnalysisResult[]>
```

### detectNarrativeClusters()
```typescript
detectNarrativeClusters(
  results: YouTubeAnalysisResult[],
  minClusterSize: number = 2
): YouTubeNarrativeCluster[]
```

---

## 🎓 Best Practices

### 1. **Keyword Selection**
- Use specific, targeted keywords
- Combine topics: "vaccine + misinformation"
- Test variations of the same concept

### 2. **Quota Management**
- Monitor daily usage
- Prioritize high-value searches
- Cache results to avoid redundant API calls

### 3. **Result Interpretation**
- Consider context and nuance
- Cross-reference with other sources
- Look for patterns across multiple videos

### 4. **Responsible Use**
- Do not harass content creators
- Report findings through proper channels
- Respect privacy and fair use

---

## 🤝 Contributing

To extend the YouTube Monitor:

1. **Add new analysis metrics** in `youtubeService.ts`
2. **Enhance UI components** in `YouTubeMonitor.tsx`
3. **Improve clustering algorithms** for better pattern detection
4. **Add data visualization** for trend analysis

---

## 📄 License

This module is part of SaakshAI and follows the same license terms.

---

## 🆘 Support

For issues or questions:
1. Check this documentation
2. Review the troubleshooting section
3. Examine console logs for detailed errors
4. Verify API key configuration

---

## 🎖️ Credits

**YouTube Misinformation Monitoring Module**
- Built on YouTube Data API v3
- Powered by SaakshAI's AI analysis engine
- UI/UX designed for intelligence professionals
- Compliant with YouTube Terms of Service

---

**Last Updated**: February 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
