
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
