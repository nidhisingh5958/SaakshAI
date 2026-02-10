import { analyzeContent } from './geminiService';
import { 
  YouTubeVideo, 
  YouTubeComment, 
  YouTubeAnalysisResult, 
  YouTubeNarrativeCluster 
} from '../types';

// Cache configuration
interface CacheEntry {
  result: YouTubeAnalysisResult;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 50;

// Rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests (YouTube API quota management)

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

// YouTube API Key (should be set via environment variable)
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';

/**
 * Get cache key for a YouTube video
 */
function getCacheKey(videoId: string): string {
  return `youtube_${videoId}`;
}

/**
 * Get cached analysis result
 */
function getCachedResult(videoId: string): YouTubeAnalysisResult | null {
  const key = getCacheKey(videoId);
  const entry = cache.get(key);
  
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.result;
  }
  
  if (entry) {
    cache.delete(key);
  }
  
  return null;
}

/**
 * Cache analysis result
 */
function setCachedResult(videoId: string, result: YouTubeAnalysisResult): void {
  const key = getCacheKey(videoId);
  
  // Evict oldest entries if cache is full
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  
  cache.set(key, {
    result,
    timestamp: Date.now()
  });
}

/**
 * Sleep for rate limiting
 */
async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Rate limit requests
 */
async function rateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await sleep(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  }
  
  lastRequestTime = Date.now();
}

/**
 * Preprocess text: remove URLs, emojis, normalize
 */
function preprocessText(text: string): string {
  if (!text) return '';
  
  return text
    // Remove URLs
    .replace(/https?:\/\/[^\s]+/g, '[LINK]')
    // Remove emojis (basic pattern)
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    // Remove special characters except basic punctuation
    .replace(/[^\w\s.,!?;:()'"-]/g, '')
    // Remove excess whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Search YouTube videos by keyword using YouTube Data API v3
 * @param query - Search query/keyword
 * @param maxResults - Number of results (max 50 per request)
 * @param order - Sort order: 'relevance', 'date', 'viewCount', 'rating'
 */
export async function searchYouTubeVideos(
  query: string,
  maxResults: number = 10,
  order: 'relevance' | 'date' | 'viewCount' | 'rating' = 'relevance'
): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key not configured. Please set VITE_YOUTUBE_API_KEY in your environment.');
  }

  await rateLimit();
  
  const encodedQuery = encodeURIComponent(query);
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodedQuery}&type=video&maxResults=${maxResults}&order=${order}&key=${YOUTUBE_API_KEY}`;
  
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        if (response.status === 403) {
          const errorData = await response.json();
          if (errorData.error?.errors?.[0]?.reason === 'quotaExceeded') {
            throw new Error('YouTube API quota exceeded. Please try again later.');
          }
          throw new Error('YouTube API access forbidden. Check your API key.');
        }
        if (response.status === 429) {
          // Rate limited
          await sleep(RETRY_DELAY * (retries + 1));
          retries++;
          continue;
        }
        throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return [];
      }

      // Extract video IDs for detailed metadata
      const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
      
      // Fetch detailed video statistics and content details
      await rateLimit();
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
      const detailsResponse = await fetch(detailsUrl);
      
      if (!detailsResponse.ok) {
        throw new Error(`YouTube API error fetching details: ${detailsResponse.status}`);
      }
      
      const detailsData = await detailsResponse.json();
      
      const videos: YouTubeVideo[] = detailsData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        viewCount: parseInt(item.statistics.viewCount) || 0,
        likeCount: parseInt(item.statistics.likeCount) || 0,
        commentCount: parseInt(item.statistics.commentCount) || 0,
        thumbnailUrl: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
        duration: item.contentDetails.duration,
        tags: item.snippet.tags || []
      }));
      
      return videos;
    } catch (error) {
      retries++;
      if (retries >= MAX_RETRIES) {
        throw error;
      }
      await sleep(RETRY_DELAY * retries);
    }
  }
  
  throw new Error('Failed to search YouTube videos after retries');
}

/**
 * Fetch top comments for a YouTube video
 * @param videoId - YouTube video ID
 * @param maxResults - Number of comments to fetch (max 100)
 */
export async function fetchVideoComments(
  videoId: string,
  maxResults: number = 20
): Promise<YouTubeComment[]> {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key not configured.');
  }

  await rateLimit();
  
  const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&order=relevance&textFormat=plainText&key=${YOUTUBE_API_KEY}`;
  
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 403) {
          const errorData = await response.json();
          if (errorData.error?.errors?.[0]?.reason === 'commentsDisabled') {
            // Comments are disabled for this video
            return [];
          }
          throw new Error('YouTube API access forbidden.');
        }
        if (response.status === 429) {
          await sleep(RETRY_DELAY * (retries + 1));
          retries++;
          continue;
        }
        throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return [];
      }
      
      const comments: YouTubeComment[] = data.items.map((item: any) => {
        const topComment = item.snippet.topLevelComment.snippet;
        return {
          id: item.snippet.topLevelComment.id,
          authorDisplayName: topComment.authorDisplayName,
          textDisplay: topComment.textDisplay,
          likeCount: topComment.likeCount,
          publishedAt: topComment.publishedAt,
          videoId: topComment.videoId
        };
      });
      
      return comments;
    } catch (error) {
      retries++;
      if (retries >= MAX_RETRIES) {
        throw error;
      }
      await sleep(RETRY_DELAY * retries);
    }
  }
  
  throw new Error('Failed to fetch YouTube comments after retries');
}

/**
 * Analyze a single YouTube video with its comments
 */
export async function analyzeYouTubeVideo(
  video: YouTubeVideo,
  comments: YouTubeComment[]
): Promise<YouTubeAnalysisResult> {
  // Check cache first
  const cachedResult = getCachedResult(video.id);
  if (cachedResult) {
    return cachedResult;
  }

  // Preprocess and combine text
  const titleText = preprocessText(video.title);
  const descriptionText = preprocessText(video.description);
  const commentsText = comments
    .map(c => preprocessText(c.textDisplay))
    .filter(t => t.length > 10) // Filter out very short comments
    .slice(0, 30) // Limit to 30 comments to avoid token limits
    .join(' | ');

  // Combine all text for analysis
  const combinedText = `
VIDEO TITLE: ${titleText}

VIDEO DESCRIPTION: ${descriptionText}

TOP COMMENTS: ${commentsText}

CHANNEL: ${video.channelTitle}
VIEWS: ${video.viewCount}
COMMENTS: ${video.commentCount}
`.trim();

  // Analyze with SaakshAI engine
  const analysis = await analyzeContent(combinedText);

  // Create result
  const result: YouTubeAnalysisResult = {
    videoId: video.id,
    title: video.title,
    description: video.description,
    channelTitle: video.channelTitle,
    publishedAt: video.publishedAt,
    viewCount: video.viewCount,
    commentCount: video.commentCount,
    thumbnailUrl: video.thumbnailUrl,
    topComments: comments.slice(0, 10), // Store top 10 comments
    credibilityScore: analysis.credibilityScore,
    fakeRiskScore: analysis.fakeRiskScore,
    threatLevel: analysis.threatLevel,
    linguisticRisks: analysis.linguisticRisks,
    emotionalTone: analysis.emotionalTone,
    viralityRisk: analysis.viralityRisk,
    analyzedAt: Date.now(),
    videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
    highlightedText: analysis.highlightedText
  };

  // Cache the result
  setCachedResult(video.id, result);

  return result;
}

/**
 * Batch analyze multiple YouTube videos
 */
export async function analyzeBatchVideos(
  videos: YouTubeVideo[],
  onProgress?: (completed: number, total: number) => void
): Promise<YouTubeAnalysisResult[]> {
  const results: YouTubeAnalysisResult[] = [];
  const total = videos.length;

  // Process in batches to manage rate limiting
  const BATCH_SIZE = 5;
  
  for (let i = 0; i < videos.length; i += BATCH_SIZE) {
    const batch = videos.slice(i, i + BATCH_SIZE);
    
    const batchPromises = batch.map(async (video) => {
      try {
        // Fetch comments for each video
        const comments = await fetchVideoComments(video.id, 30);
        
        // Analyze video
        const analysis = await analyzeYouTubeVideo(video, comments);
        
        return analysis;
      } catch (error) {
        console.error(`Failed to analyze video ${video.id}:`, error);
        // Return a minimal result on error
        return {
          videoId: video.id,
          title: video.title,
          description: video.description,
          channelTitle: video.channelTitle,
          publishedAt: video.publishedAt,
          viewCount: video.viewCount,
          commentCount: video.commentCount,
          thumbnailUrl: video.thumbnailUrl,
          topComments: [],
          credibilityScore: 50,
          fakeRiskScore: 0,
          threatLevel: 'low' as const,
          linguisticRisks: [],
          emotionalTone: { anger: 0, fear: 0, urgency: 0, neutrality: 100, joy: 0 },
          viralityRisk: { score: 0, triggers: [], potentialImpact: 'Unknown' },
          analyzedAt: Date.now(),
          videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
          highlightedText: []
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    if (onProgress) {
      onProgress(Math.min(i + BATCH_SIZE, total), total);
    }

    // Add delay between batches
    if (i + BATCH_SIZE < videos.length) {
      await sleep(1000);
    }
  }

  return results;
}

/**
 * Detect narrative clusters across multiple YouTube videos
 */
export function detectNarrativeClusters(
  results: YouTubeAnalysisResult[],
  minClusterSize: number = 2
): YouTubeNarrativeCluster[] {
  if (results.length < minClusterSize) {
    return [];
  }

  // Simple clustering based on linguistic risks and themes
  const clusters: Map<string, YouTubeAnalysisResult[]> = new Map();

  for (const result of results) {
    // Only cluster videos with significant risk
    if (result.fakeRiskScore < 40) {
      continue;
    }

    // Create a signature based on linguistic risks
    const riskTypes = result.linguisticRisks
      .map(r => r.type)
      .sort()
      .join('|');

    if (!riskTypes) {
      continue;
    }

    if (!clusters.has(riskTypes)) {
      clusters.set(riskTypes, []);
    }

    clusters.get(riskTypes)!.push(result);
  }

  // Convert to cluster objects
  const narrativeClusters: YouTubeNarrativeCluster[] = [];
  let clusterIndex = 0;

  for (const [riskSignature, videos] of clusters.entries()) {
    if (videos.length >= minClusterSize) {
      const avgFakeRisk = videos.reduce((sum, v) => sum + v.fakeRiskScore, 0) / videos.length;
      
      // Determine average threat level
      const threatLevels = videos.map(v => v.threatLevel);
      const criticalCount = threatLevels.filter(t => t === 'critical').length;
      const highCount = threatLevels.filter(t => t === 'high').length;
      
      let avgThreatLevel: 'low' | 'medium' | 'high' | 'critical';
      if (criticalCount > videos.length / 2) {
        avgThreatLevel = 'critical';
      } else if (highCount + criticalCount > videos.length / 2) {
        avgThreatLevel = 'high';
      } else if (videos.some(v => v.threatLevel === 'medium')) {
        avgThreatLevel = 'medium';
      } else {
        avgThreatLevel = 'low';
      }

      // Generate theme description
      const commonRisks = videos[0].linguisticRisks.map(r => r.type).join(', ');
      const theme = `Videos showing similar patterns: ${commonRisks}`;

      // Update results with cluster ID
      const clusterId = `youtube_cluster_${clusterIndex}`;
      videos.forEach(v => {
        v.narrativeClusterId = clusterId;
      });

      narrativeClusters.push({
        id: clusterId,
        theme,
        videoIds: videos.map(v => v.videoId),
        averageFakeRisk: avgFakeRisk,
        averageThreatLevel: avgThreatLevel,
        detectedAt: Date.now()
      });

      clusterIndex++;
    }
  }

  return narrativeClusters;
}

/**
 * Get trending misinformation topics from analyzed videos
 */
export function getTrendingMisinformationTopics(
  results: YouTubeAnalysisResult[]
): Array<{ topic: string; count: number; avgRisk: number }> {
  const topicMap = new Map<string, { count: number; totalRisk: number }>();

  for (const result of results) {
    if (result.fakeRiskScore < 50) {
      continue;
    }

    for (const risk of result.linguisticRisks) {
      const topic = risk.type;
      
      if (!topicMap.has(topic)) {
        topicMap.set(topic, { count: 0, totalRisk: 0 });
      }

      const entry = topicMap.get(topic)!;
      entry.count++;
      entry.totalRisk += result.fakeRiskScore;
    }
  }

  return Array.from(topicMap.entries())
    .map(([topic, data]) => ({
      topic,
      count: data.count,
      avgRisk: data.totalRisk / data.count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}
