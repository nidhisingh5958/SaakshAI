
export interface LinguisticIndicator {
  type: 'clickbait' | 'sensationalism' | 'fear-mongering' | 'vague-claims' | 'authority-misuse';
  severity: number; // 0-100
  description: string;
  foundPhrases: string[];
}

export interface ClaimBreakdown {
  claim: string;
  verdict: 'verified' | 'unverified' | 'refuted';
  sourceRelevance: number;
  explanation: string;
}

export interface AnalysisResult {
  language: string;
  credibilityScore: number; // 0-100
  fakeRiskScore: number; // 0-100
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  linguisticRisks: LinguisticIndicator[];
  emotionalTone: {
    anger: number;
    fear: number;
    urgency: number;
    neutrality: number;
    joy: number;
  };
  viralityRisk: {
    score: number;
    triggers: string[];
    potentialImpact: string;
  };
  claims: ClaimBreakdown[];
  newsRelevance: {
    topicMatch: number;
    topTrustedSources: string[];
    summaryOfVerifiedFacts: string;
  };
  highlightedText: Array<{
    text: string;
    type: 'suspicious' | 'verified' | 'neutral';
    tooltip?: string;
  }>;
}

export type AnalysisStatus = 'idle' | 'processing' | 'completed' | 'error';

// Reddit Integration Types
export interface RedditPost {
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

export interface RedditComment {
  id: string;
  author: string;
  body: string;
  score: number;
  created: number;
}

export interface RedditAnalysisResult {
  postId: string;
  subreddit: string;
  title: string;
  postText: string;
  topComments: RedditComment[];
  credibilityScore: number;
  fakeRiskScore: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  linguisticRisks: LinguisticIndicator[];
  emotionalTone: {
    anger: number;
    fear: number;
    urgency: number;
    neutrality: number;
    joy: number;
  };
  viralityRisk: {
    score: number;
    triggers: string[];
    potentialImpact: string;
  };
  narrativeClusterId?: string;
  analyzedAt: number;
  postUrl: string;
}

export interface NarrativeCluster {
  id: string;
  subreddit: string;
  theme: string;
  postIds: string[];
  averageFakeRisk: number;
  averageThreatLevel: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: number;
}

export type RedditMonitorStatus = 'idle' | 'fetching' | 'analyzing' | 'completed' | 'error';

// YouTube Integration Types
export interface YouTubeVideo {
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

export interface YouTubeComment {
  id: string;
  authorDisplayName: string;
  textDisplay: string;
  likeCount: number;
  publishedAt: string;
  videoId: string;
}

export interface YouTubeAnalysisResult {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
  commentCount: number;
  thumbnailUrl: string;
  topComments: YouTubeComment[];
  credibilityScore: number;
  fakeRiskScore: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  linguisticRisks: LinguisticIndicator[];
  emotionalTone: {
    anger: number;
    fear: number;
    urgency: number;
    neutrality: number;
    joy: number;
  };
  viralityRisk: {
    score: number;
    triggers: string[];
    potentialImpact: string;
  };
  narrativeClusterId?: string;
  analyzedAt: number;
  videoUrl: string;
  highlightedText: Array<{
    text: string;
    type: 'suspicious' | 'verified' | 'neutral';
    tooltip?: string;
  }>;
}

export interface YouTubeNarrativeCluster {
  id: string;
  theme: string;
  videoIds: string[];
  averageFakeRisk: number;
  averageThreatLevel: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: number;
}

export type YouTubeMonitorStatus = 'idle' | 'fetching' | 'analyzing' | 'completed' | 'error';
