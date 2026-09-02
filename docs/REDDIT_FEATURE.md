# Reddit Narrative Intelligence Module

## 🎯 Overview

The **Reddit Narrative Intelligence Module** transforms SaakshAI from a manual text analysis tool into a **real-time social narrative intelligence system**. It monitors Reddit discussions, detects misinformation patterns, and identifies emerging narrative campaigns before they go mainstream.

---

## ✨ Key Capabilities

### 1. **Live Social Media Monitoring**
- Monitor any subreddit for suspicious content
- Search across Reddit or within specific communities
- Analyze both posts and top comments together

### 2. **Automated Misinformation Detection**
- Every Reddit post gets the full SaakshAI treatment:
  - Credibility scoring
  - Fake risk assessment
  - Threat level classification
  - Linguistic manipulation detection
  - Emotional tone analysis
  - Virality prediction

### 3. **Narrative Cluster Detection** 🔥
The module automatically identifies when multiple high-risk posts appear in the same subreddit, flagging potential:
- Coordinated misinformation campaigns
- Emerging viral narratives
- Manipulation attempts
- Information warfare patterns

### 4. **Batch Intelligence Processing**
- Analyzes 5-20 posts at once
- Smart caching prevents re-analysis
- Progress tracking shows real-time status
- Rate limiting ensures API stability

---

## 🖥️ User Interface

### **Input Panel**
Simple, intuitive controls:
```
┌─────────────────────────────────────────┐
│ Subreddit: r/[technology]               │
│ Keyword:   [vaccine]                    │
│ [Start Monitoring]                      │
└─────────────────────────────────────────┘
```

### **Narrative Alert Banner**
When high-risk patterns detected:
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ⚠️  HIGH-RISK NARRATIVE DETECTED        ┃
┃                                          ┃
┃ Multiple posts with high misinformation ┃
┃ risk detected in this subreddit         ┃
┃                                          ┃
┃ r/technology: 5 risky posts (Avg 78%)   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### **Post Risk Table**
Sortable table with key metrics:

| Post Title | Credibility | Fake Risk | Threat | Emotional Tone | Actions |
|------------|-------------|-----------|--------|----------------|---------|
| "Breaking: New Study Shows..." | 45% | 72% | HIGH | Anger, Fear | [View] |
| "Government Officials Confirm..." | 78% | 23% | LOW | Neutral | [View] |

**Sorting Options:**
- Fake Risk Score (default)
- Credibility Score
- Virality Risk

### **Post Detail Modal**
Click any post for deep analysis:
- 📊 Full score breakdown (4 key metrics)
- 🎯 Emotional radar chart
- ⚠️ Linguistic risk breakdown with examples
- 💬 Top comments (up to 10)
- 🔗 Direct link to Reddit post

---

## 🔧 Technical Implementation

### **Service Architecture**

#### `redditService.ts`
Core service handling all Reddit operations:

**Functions:**
- `fetchSubredditPosts(subreddit, sort, limit)` - Get posts from a subreddit
- `searchRedditPosts(query, subreddit, limit)` - Search Reddit content
- `fetchPostComments(subreddit, postId, limit)` - Get top comments
- `analyzeRedditPost(post, includeComments, commentLimit)` - Full analysis
- `analyzeBatchPosts(posts, batchSize, ...)` - Batch processing
- `detectNarrativeClusters(results, minFakeRisk, minClusterSize)` - Detect campaigns
- `clearCache()` - Cache management

**Features:**
- ✅ Uses Reddit's public JSON API (no OAuth needed)
- ✅ Automatic rate limiting (2s between requests)
- ✅ Retry logic with exponential backoff
- ✅ Text preprocessing (removes markdown, URLs)
- ✅ Smart caching (5-minute TTL)
- ✅ Progress callbacks for UI updates

### **Type System**

```typescript
// Core Reddit types
interface RedditPost {
  id: string;
  subreddit: string;
  title: string;
  selftext: string;
  author: string;
  score: number;
  upvoteRatio: number;
  numComments: number;
  created: number;
  url: string;
  permalink: string;
}

interface RedditComment {
  id: string;
  author: string;
  body: string;
  score: number;
  created: number;
}

// Analysis result
interface RedditAnalysisResult {
  postId: string;
  subreddit: string;
  title: string;
  postText: string;
  topComments: RedditComment[];
  // ... all SaakshAI metrics ...
  narrativeClusterId?: string;
  analyzedAt: number;
  postUrl: string;
}

// Narrative detection
interface NarrativeCluster {
  id: string;
  subreddit: string;
  theme: string;
  postIds: string[];
  averageFakeRisk: number;
  averageThreatLevel: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: number;
}
```

### **Component Architecture**

#### `RedditMonitor.tsx`
Main React component (500+ lines):

**State Management:**
- Input state (subreddit, keyword)
- Monitor status (idle → fetching → analyzing → completed)
- Results and clusters
- Selected post for detail view
- Error handling
- Progress tracking

**Features:**
- Real-time status updates
- Sortable results table
- Modal detail view with charts
- Narrative alerts
- Error boundaries

---

## 🔄 Data Flow

```
User Input (r/technology + "AI")
        ↓
Click "Start Monitoring"
        ↓
Status: FETCHING
        ↓
searchRedditPosts("AI", "technology", 20)
        ↓
Reddit JSON API Returns 20 Posts
        ↓
Status: ANALYZING (0/20)
        ↓
For Each Batch of 5 Posts:
  1. Fetch top 20 comments
  2. Preprocess text
  3. Combine post + comments
  4. Call analyzeContent()
  5. Cache result
  6. Update progress (5/20, 10/20, ...)
        ↓
All Posts Analyzed
        ↓
detectNarrativeClusters()
  - Filter posts with fakeRisk >= 60%
  - Group by subreddit
  - Identify clusters (≥2 posts)
        ↓
Status: COMPLETED
        ↓
Display Results + Alerts
```

---

## ⚡ Performance & Optimization

### **Caching Strategy**
```javascript
Cache Structure: Map<postId, {result, timestamp}>
TTL: 5 minutes
Max Size: 50 entries
Eviction: FIFO when full
```

**Why?**
- Prevents re-analyzing same posts
- Reduces API costs
- Faster response for repeated queries

### **Rate Limiting**
```javascript
Min Request Interval: 2 seconds
Retry Logic: 3 attempts max
Backoff: Exponential (2s, 4s, 8s)
```

**Why?**
- Respects Reddit's API limits
- Prevents 429 errors
- Ensures reliability

### **Batch Processing**
```javascript
Default Batch Size: 5 posts
Delay Between Batches: 1 second
```

**Why?**
- Parallel processing efficiency
- Progressive UI updates
- Manageable API load

### **Text Preprocessing**
```javascript
Steps:
1. Remove markdown links [text](url) → text
2. Strip URLs → [LINK]
3. Remove markdown formatting (*, _, ~, `)
4. Normalize whitespace
```

**Why?**
- Cleaner analysis input
- Reduces token count
- Focus on semantic content

---

## 🎯 Use Cases

### 1. **Brand Monitoring**
Monitor brand mentions for misinformation:
```
Subreddit: technology
Keyword: YourBrand
→ Identify false claims early
```

### 2. **Topic Investigation**
Track narratives around controversial topics:
```
Subreddit: worldnews
Keyword: climate change
→ Spot manipulation tactics
```

### 3. **Community Health**
Monitor subreddits for coordinated attacks:
```
Subreddit: your_community
Keyword: (leave empty)
→ Detect brigading patterns
```

### 4. **Research**
Academic study of misinformation spread:
```
Multiple Subreddits
Various Keywords
→ Analyze narrative evolution
```

---

## 🔐 Compliance & Ethics

### **Data Handling**
✅ Uses public Reddit API only  
✅ No scraping or unauthorized access  
✅ Does not store personal user data  
✅ Only stores post content for analysis  
✅ Respects Reddit's rate limits  

### **Privacy**
✅ No login required  
✅ No user tracking  
✅ Analysis is anonymous  
✅ Cache is local (not shared)  

### **Responsible Use**
⚠️ Tool is for research and awareness  
⚠️ Not for harassment or doxxing  
⚠️ Results should be verified independently  
⚠️ Context matters in interpretation  

---

## 📈 Future Enhancements

### **Planned Features**
- [ ] Export results to CSV/JSON
- [ ] Historical tracking (24h/7d trends)
- [ ] Multi-subreddit comparison
- [ ] Author analysis (repeat offenders)
- [ ] Sentiment trend graphs
- [ ] Keyword cloud visualization
- [ ] Auto-monitoring (periodic checks)
- [ ] Email/Slack alerts for high-risk posts
- [ ] API endpoint for external integrations

### **Advanced Analytics**
- [ ] Network analysis (cross-posting patterns)
- [ ] Bot detection scoring
- [ ] Influence mapping
- [ ] Temporal pattern recognition
- [ ] Language fingerprinting

---

## 🚀 Quick Start

### **Basic Usage**

1. **Monitor a Subreddit:**
   ```
   Subreddit: technology
   Keyword: (leave empty)
   ```

2. **Search by Keyword:**
   ```
   Subreddit: (leave empty)
   Keyword: cryptocurrency scam
   ```

3. **Combined Search:**
   ```
   Subreddit: worldnews
   Keyword: election fraud
   ```

### **Interpreting Results**

**High Credibility (>70%) + Low Fake Risk (<30%)**
→ ✅ Likely trustworthy content

**Low Credibility (<50%) + High Fake Risk (>60%)**
→ ⚠️ Requires fact-checking

**Multiple High-Risk Posts + Narrative Alert**
→ 🚨 Potential coordinated campaign

**High Emotional Tone (Anger/Fear >70%)**
→ 🎯 Manipulation tactics detected

---

## 🤝 Contributing

Want to enhance the Reddit module? Areas for contribution:

- **UI/UX**: Improve visualizations
- **Performance**: Optimize caching/batching
- **Features**: Add export, alerts, etc.
- **Testing**: Unit/integration tests
- **Documentation**: Usage guides

---

## 📞 Support

Questions about the Reddit module?

1. Check the main [README.md](./README.md)
2. Review this document
3. Open an issue on GitHub
4. Include: subreddit, keyword, error message, screenshot

---

**The Reddit Narrative Intelligence Module turns SaakshAI into a proactive defense system against coordinated misinformation campaigns on social media.**

**Stay vigilant. Stay informed. 🛡️**
