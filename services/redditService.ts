import { analyzeContent } from './geminiService';
import { 
  RedditPost, 
  RedditComment, 
  RedditAnalysisResult, 
  NarrativeCluster 
} from '../types';

// Cache configuration
interface CacheEntry {
  result: RedditAnalysisResult;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 50;

// Rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

/**
 * Get cache key for a Reddit post
 */
function getCacheKey(postId: string): string {
  return `reddit_${postId}`;
}

/**
 * Get cached analysis result
 */
function getCachedResult(postId: string): RedditAnalysisResult | null {
  const key = getCacheKey(postId);
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
function setCachedResult(postId: string, result: RedditAnalysisResult): void {
  const key = getCacheKey(postId);
  
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
 * Preprocess text: remove markdown, strip URLs, normalize
 */
function preprocessText(text: string): string {
  if (!text) return '';
  
  return text
    // Remove markdown links [text](url)
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remove URLs
    .replace(/https?:\/\/[^\s]+/g, '[LINK]')
    // Remove markdown formatting
    .replace(/[*_~`]/g, '')
    // Remove excess whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Fetch posts from a subreddit using Reddit's JSON API (no auth required)
 * @param subreddit - Subreddit name (without r/)
 * @param sort - Sort type: 'new', 'hot', 'top'
 * @param limit - Number of posts to fetch (max 100)
 */
export async function fetchSubredditPosts(
  subreddit: string,
  sort: 'new' | 'hot' | 'top' = 'hot',
  limit: number = 10
): Promise<RedditPost[]> {
  await rateLimit();
  
  const url = `https://www.reddit.com/r/${subreddit}/${sort}.json?limit=${limit}`;
  
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SaakshAI/1.0'
        }
      });
      
      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited
          await sleep(RETRY_DELAY * (retries + 1));
          retries++;
          continue;
        }
        throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.data || !data.data.children) {
        throw new Error('Invalid Reddit API response');
      }
      
      const posts: RedditPost[] = data.data.children
        .filter((child: any) => child.kind === 't3')
        .map((child: any) => {
          const post = child.data;
          return {
            id: post.id,
            subreddit: post.subreddit,
            title: post.title,
            selftext: post.selftext || '',
            author: post.author,
            score: post.score,
            upvoteRatio: post.upvote_ratio,
            numComments: post.num_comments,
            created: post.created_utc,
            url: post.url,
            permalink: `https://www.reddit.com${post.permalink}`
          };
        });
      
      return posts;
    } catch (error) {
      retries++;
      if (retries >= MAX_RETRIES) {
        throw error;
      }
      await sleep(RETRY_DELAY * retries);
    }
  }
  
  throw new Error('Failed to fetch Reddit posts after retries');
}

/**
 * Search Reddit posts by keyword
 * @param query - Search query
 * @param subreddit - Optional subreddit to search within
 * @param limit - Number of results (max 100)
 */
export async function searchRedditPosts(
  query: string,
  subreddit?: string,
  limit: number = 10
): Promise<RedditPost[]> {
  await rateLimit();
  
  const encodedQuery = encodeURIComponent(query);
  const subredditParam = subreddit ? `&restrict_sr=on` : '';
  const baseUrl = subreddit 
    ? `https://www.reddit.com/r/${subreddit}/search.json`
    : `https://www.reddit.com/search.json`;
  const url = `${baseUrl}?q=${encodedQuery}${subredditParam}&limit=${limit}&sort=relevance`;
  
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SaakshAI/1.0'
        }
      });
      
      if (!response.ok) {
        if (response.status === 429) {
          await sleep(RETRY_DELAY * (retries + 1));
          retries++;
          continue;
        }
        throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.data || !data.data.children) {
        throw new Error('Invalid Reddit API response');
      }
      
      const posts: RedditPost[] = data.data.children
        .filter((child: any) => child.kind === 't3')
        .map((child: any) => {
          const post = child.data;
          return {
            id: post.id,
            subreddit: post.subreddit,
            title: post.title,
            selftext: post.selftext || '',
            author: post.author,
            score: post.score,
            upvoteRatio: post.upvote_ratio,
            numComments: post.num_comments,
            created: post.created_utc,
            url: post.url,
            permalink: `https://www.reddit.com${post.permalink}`
          };
        });
      
      return posts;
    } catch (error) {
      retries++;
      if (retries >= MAX_RETRIES) {
        throw error;
      }
      await sleep(RETRY_DELAY * retries);
    }
  }
  
  throw new Error('Failed to search Reddit posts after retries');
}

/**
 * Fetch comments for a Reddit post
 * @param subreddit - Subreddit name
 * @param postId - Post ID
 * @param limit - Number of top comments to fetch
 */
export async function fetchPostComments(
  subreddit: string,
  postId: string,
  limit: number = 20
): Promise<RedditComment[]> {
  await rateLimit();
  
  const url = `https://www.reddit.com/r/${subreddit}/comments/${postId}.json?limit=${limit}&depth=1&sort=top`;
  
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SaakshAI/1.0'
        }
      });
      
      if (!response.ok) {
        if (response.status === 429) {
          await sleep(RETRY_DELAY * (retries + 1));
          retries++;
          continue;
        }
        throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data) || data.length < 2) {
        return [];
      }
      
      const commentsData = data[1];
      if (!commentsData.data || !commentsData.data.children) {
        return [];
      }
      
      const comments: RedditComment[] = commentsData.data.children
        .filter((child: any) => child.kind === 't1' && child.data.body)
        .slice(0, limit)
        .map((child: any) => {
          const comment = child.data;
          return {
            id: comment.id,
            author: comment.author,
            body: comment.body,
            score: comment.score,
            created: comment.created_utc
          };
        });
      
      return comments;
    } catch (error) {
      retries++;
      if (retries >= MAX_RETRIES) {
        console.warn(`Failed to fetch comments for post ${postId}:`, error);
        return []; // Return empty array on failure
      }
      await sleep(RETRY_DELAY * retries);
    }
  }
  
  return [];
}

/**
 * Analyze a Reddit post with its comments
 */
export async function analyzeRedditPost(
  post: RedditPost,
  includeComments: boolean = true,
  commentLimit: number = 20
): Promise<RedditAnalysisResult> {
  // Check cache first
  const cached = getCachedResult(post.id);
  if (cached) {
    return cached;
  }
  
  // Fetch comments if needed
  let topComments: RedditComment[] = [];
  if (includeComments && post.numComments > 0) {
    topComments = await fetchPostComments(post.subreddit, post.id, commentLimit);
  }
  
  // Combine post and comments into analysis text
  const preprocessedTitle = preprocessText(post.title);
  const preprocessedBody = preprocessText(post.selftext);
  const preprocessedComments = topComments
    .map(c => preprocessText(c.body))
    .filter(text => text.length > 0)
    .slice(0, 10); // Limit to avoid token overflow
  
  let analysisText = `Post Title: ${preprocessedTitle}`;
  if (preprocessedBody) {
    analysisText += `\n\nPost Content: ${preprocessedBody}`;
  }
  if (preprocessedComments.length > 0) {
    analysisText += `\n\nTop Comments:\n${preprocessedComments.join('\n---\n')}`;
  }
  
  // Analyze with SaakshAI engine
  const analysis = await analyzeContent(analysisText);
  
  // Build result
  const result: RedditAnalysisResult = {
    postId: post.id,
    subreddit: post.subreddit,
    title: post.title,
    postText: post.selftext,
    topComments,
    credibilityScore: analysis.credibilityScore,
    fakeRiskScore: analysis.fakeRiskScore,
    threatLevel: analysis.threatLevel,
    linguisticRisks: analysis.linguisticRisks,
    emotionalTone: analysis.emotionalTone,
    viralityRisk: analysis.viralityRisk,
    analyzedAt: Date.now(),
    postUrl: post.permalink
  };
  
  // Cache result
  setCachedResult(post.id, result);
  
  return result;
}

/**
 * Analyze multiple Reddit posts in batches
 */
export async function analyzeBatchPosts(
  posts: RedditPost[],
  batchSize: number = 5,
  includeComments: boolean = true,
  commentLimit: number = 20,
  onProgress?: (completed: number, total: number) => void
): Promise<RedditAnalysisResult[]> {
  const results: RedditAnalysisResult[] = [];
  
  for (let i = 0; i < posts.length; i += batchSize) {
    const batch = posts.slice(i, i + batchSize);
    
    const batchResults = await Promise.all(
      batch.map(post => 
        analyzeRedditPost(post, includeComments, commentLimit)
          .catch(error => {
            console.error(`Failed to analyze post ${post.id}:`, error);
            return null;
          })
      )
    );
    
    results.push(...batchResults.filter(r => r !== null) as RedditAnalysisResult[]);
    
    if (onProgress) {
      onProgress(Math.min(i + batchSize, posts.length), posts.length);
    }
    
    // Small delay between batches
    if (i + batchSize < posts.length) {
      await sleep(1000);
    }
  }
  
  return results;
}

/**
 * Detect emerging narrative clusters from analyzed posts
 */
export function detectNarrativeClusters(
  results: RedditAnalysisResult[],
  minFakeRisk: number = 60,
  minClusterSize: number = 2
): NarrativeCluster[] {
  // Filter high-risk posts
  const highRiskPosts = results.filter(r => r.fakeRiskScore >= minFakeRisk);
  
  if (highRiskPosts.length < minClusterSize) {
    return [];
  }
  
  // Group by subreddit
  const subredditGroups = new Map<string, RedditAnalysisResult[]>();
  for (const post of highRiskPosts) {
    const existing = subredditGroups.get(post.subreddit) || [];
    existing.push(post);
    subredditGroups.set(post.subreddit, existing);
  }
  
  const clusters: NarrativeCluster[] = [];
  
  for (const [subreddit, posts] of subredditGroups.entries()) {
    if (posts.length >= minClusterSize) {
      // Calculate average threat level
      const threatLevelValues = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
      const avgThreatValue = posts.reduce((sum, p) => sum + threatLevelValues[p.threatLevel], 0) / posts.length;
      const avgThreatLevel: 'low' | 'medium' | 'high' | 'critical' = 
        avgThreatValue >= 3.5 ? 'critical' :
        avgThreatValue >= 2.5 ? 'high' :
        avgThreatValue >= 1.5 ? 'medium' : 'low';
      
      clusters.push({
        id: `cluster_${subreddit}_${Date.now()}`,
        subreddit,
        theme: `Multiple high-risk posts detected`,
        postIds: posts.map(p => p.postId),
        averageFakeRisk: posts.reduce((sum, p) => sum + p.fakeRiskScore, 0) / posts.length,
        averageThreatLevel: avgThreatLevel,
        detectedAt: Date.now()
      });
    }
  }
  
  return clusters;
}

/**
 * Clear the cache (useful for testing)
 */
export function clearCache(): void {
  cache.clear();
}
