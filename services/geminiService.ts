
import { GoogleGenAI, Type } from "@google/genai";
import Groq from "groq-sdk";
import { AnalysisResult } from "../types";

// Primary: Gemini API (process.env.GEMINI_API_KEY)
// Fallback: Groq API (process.env.GROQ_API_KEY)

// Cache configuration
interface CacheEntry {
  result: AnalysisResult;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100;

// Batch processing queue
interface BatchRequest {
  text: string;
  resolve: (result: AnalysisResult) => void;
  reject: (error: Error) => void;
}

let batchQueue: BatchRequest[] = [];
let batchTimer: NodeJS.Timeout | null = null;
const BATCH_DELAY = 200; // ms
const BATCH_SIZE = 5;

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

function getCacheKey(text: string): string {
  // Simple hash function for cache key
  return text.trim().toLowerCase().substring(0, 500);
}

function getCachedResult(text: string): AnalysisResult | null {
  const key = getCacheKey(text);
  const entry = cache.get(key);
  
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.result;
  }
  
  if (entry) {
    cache.delete(key);
  }
  
  return null;
}

function setCachedResult(text: string, result: AnalysisResult): void {
  const key = getCacheKey(text);
  
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

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Gemini schema
const geminiAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    language: { type: Type.STRING },
    credibilityScore: { type: Type.NUMBER },
    fakeRiskScore: { type: Type.NUMBER },
    threatLevel: { type: Type.STRING, enum: ['low', 'medium', 'high', 'critical'] },
    linguisticRisks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          severity: { type: Type.NUMBER },
          description: { type: Type.STRING },
          foundPhrases: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['type', 'severity', 'description', 'foundPhrases']
      }
    },
    emotionalTone: {
      type: Type.OBJECT,
      properties: {
        anger: { type: Type.NUMBER },
        fear: { type: Type.NUMBER },
        urgency: { type: Type.NUMBER },
        neutrality: { type: Type.NUMBER },
        joy: { type: Type.NUMBER }
      },
      required: ['anger', 'fear', 'urgency', 'neutrality', 'joy']
    },
    viralityRisk: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        triggers: { type: Type.ARRAY, items: { type: Type.STRING } },
        potentialImpact: { type: Type.STRING }
      },
      required: ['score', 'triggers', 'potentialImpact']
    },
    claims: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          claim: { type: Type.STRING },
          verdict: { type: Type.STRING, enum: ['verified', 'unverified', 'refuted'] },
          sourceRelevance: { type: Type.NUMBER },
          explanation: { type: Type.STRING }
        },
        required: ['claim', 'verdict', 'sourceRelevance', 'explanation']
      }
    },
    newsRelevance: {
      type: Type.OBJECT,
      properties: {
        topicMatch: { type: Type.NUMBER },
        topTrustedSources: { type: Type.ARRAY, items: { type: Type.STRING } },
        summaryOfVerifiedFacts: { type: Type.STRING }
      },
      required: ['topicMatch', 'topTrustedSources', 'summaryOfVerifiedFacts']
    },
    highlightedText: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['suspicious', 'verified', 'neutral'] },
          tooltip: { type: Type.STRING }
        },
        required: ['text', 'type']
      }
    }
  },
  required: [
    'language', 'credibilityScore', 'fakeRiskScore', 'threatLevel',
    'linguisticRisks', 'emotionalTone', 'viralityRisk', 'claims',
    'newsRelevance', 'highlightedText'
  ]
};

// Groq schema
const groqJsonResponseFormat = {
  type: "json_schema",
  json_schema: {
    name: "analysis_result",
    strict: true,
    schema: {
      type: "object",
      properties: {
        language: { type: "string" },
        credibilityScore: { type: "number" },
        fakeRiskScore: { type: "number" },
        threatLevel: { type: "string", enum: ["low", "medium", "high", "critical"] },
        linguisticRisks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string" },
              severity: { type: "number" },
              description: { type: "string" },
              foundPhrases: { type: "array", items: { type: "string" } }
            },
            required: ["type", "severity", "description", "foundPhrases"],
            additionalProperties: false
          }
        },
        emotionalTone: {
          type: "object",
          properties: {
            anger: { type: "number" },
            fear: { type: "number" },
            urgency: { type: "number" },
            neutrality: { type: "number" },
            joy: { type: "number" }
          },
          required: ["anger", "fear", "urgency", "neutrality", "joy"],
          additionalProperties: false
        },
        viralityRisk: {
          type: "object",
          properties: {
            score: { type: "number" },
            triggers: { type: "array", items: { type: "string" } },
            potentialImpact: { type: "string" }
          },
          required: ["score", "triggers", "potentialImpact"],
          additionalProperties: false
        },
        claims: {
          type: "array",
          items: {
            type: "object",
            properties: {
              claim: { type: "string" },
              verdict: { type: "string", enum: ["verified", "unverified", "refuted"] },
              sourceRelevance: { type: "number" },
              explanation: { type: "string" }
            },
            required: ["claim", "verdict", "sourceRelevance", "explanation"],
            additionalProperties: false
          }
        },
        newsRelevance: {
          type: "object",
          properties: {
            topicMatch: { type: "number" },
            topTrustedSources: { type: "array", items: { type: "string" } },
            summaryOfVerifiedFacts: { type: "string" }
          },
          required: ["topicMatch", "topTrustedSources", "summaryOfVerifiedFacts"],
          additionalProperties: false
        },
        highlightedText: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              type: { type: "string", enum: ["suspicious", "verified", "neutral"] },
              tooltip: { type: "string" }
            },
            required: ["text", "type"],
            additionalProperties: false
          }
        }
      },
      required: [
        "language", "credibilityScore", "fakeRiskScore", "threatLevel",
        "linguisticRisks", "emotionalTone", "viralityRisk", "claims",
        "newsRelevance", "highlightedText"
      ],
      additionalProperties: false
    }
  }
};

async function executeWithRetry<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delay: number = INITIAL_RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries === 0) {
      throw error;
    }

    const isRateLimitError = error?.status === 'RESOURCE_EXHAUSTED' || 
                              error?.code === 429 ||
                              error?.message?.includes('quota');

    if (isRateLimitError) {
      // Extract retry delay from error if available
      const retryDelay = error?.details?.find((d: any) => d['@type']?.includes('RetryInfo'))?.retryDelay;
      const waitTime = retryDelay 
        ? parseInt(retryDelay.replace('s', '')) * 1000 
        : delay;

      console.log(`Rate limit hit. Retrying in ${waitTime}ms... (${retries} retries left)`);
      await sleep(waitTime);
      
      // Exponential backoff for subsequent retries
      return executeWithRetry(fn, retries - 1, delay * 2);
    }

    // For other errors, throw immediately
    throw error;
  }
}

async function analyzeWithGemini(text: string): Promise<AnalysisResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `
    You are a professional misinformation intelligence engine.
    Analyze the following text for:
    1. Multilingual verification (Identify language and cross-reference).
    2. Linguistic manipulation (Clickbait, sensationalism, fear, urgency).
    3. Claim extraction and verification against known news facts (Simulated RAG).
    4. Emotional tone analysis.
    5. Virality and threat estimation.

    Input Text:
    """
    ${text}
    """

    Ensure the "highlightedText" array reconstructs the original input text fully by splitting it into parts.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: geminiAnalysisSchema,
      temperature: 0.1,
    },
  });

  const resultText = response.text || "{}";
  return JSON.parse(resultText);
}

async function analyzeWithGroq(text: string): Promise<AnalysisResult> {
  const groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY,
    dangerouslyAllowBrowser: true
  });
  
  const systemPrompt = `You are a professional misinformation intelligence engine.
Analyze the following text for:
1. Multilingual verification (Identify language and cross-reference).
2. Linguistic manipulation (Clickbait, sensationalism, fear, urgency).
3. Claim extraction and verification against known news facts (Simulated RAG).
4. Emotional tone analysis.
5. Virality and threat estimation.

Ensure the "highlightedText" array reconstructs the original input text fully by splitting it into parts.

Return a JSON object with this exact structure:
{
  "language": "string",
  "credibilityScore": number (0-100),
  "fakeRiskScore": number (0-100),
  "threatLevel": "low" | "medium" | "high" | "critical",
  "linguisticRisks": [{"type": "string", "severity": number, "description": "string", "foundPhrases": ["string"]}],
  "emotionalTone": {"anger": number, "fear": number, "urgency": number, "neutrality": number, "joy": number},
  "viralityRisk": {"score": number, "triggers": ["string"], "potentialImpact": "string"},
  "claims": [{"claim": "string", "verdict": "verified|unverified|refuted", "sourceRelevance": number, "explanation": "string"}],
  "newsRelevance": {"topicMatch": number, "topTrustedSources": ["string"], "summaryOfVerifiedFacts": "string"},
  "highlightedText": [{"text": "string", "type": "suspicious|verified|neutral", "tooltip": "string"}]
}`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Input Text:\n"""\n${text}\n"""` }
    ],
    temperature: 0.1,
    response_format: { type: "json_object" },
  });

  const resultText = response.choices[0]?.message?.content || "{}";
  return JSON.parse(resultText);
}

async function analyzeContentInternal(text: string): Promise<AnalysisResult> {
  // Try Gemini first
  try {
    console.log('Using Gemini API...');
    return await analyzeWithGemini(text);
  } catch (geminiError: any) {
    const isQuotaError = geminiError?.status === 'RESOURCE_EXHAUSTED' || 
                         geminiError?.code === 429 ||
                         geminiError?.message?.includes('quota');
    
    // If Gemini fails with quota/rate limit, fallback to Groq
    if (isQuotaError && process.env.GROQ_API_KEY) {
      console.log('Gemini quota exceeded, falling back to Groq...');
      try {
        return await analyzeWithGroq(text);
      } catch (groqError) {
        console.error('Groq fallback failed:', groqError);
        throw groqError;
      }
    }
    
    // For non-quota errors or no Groq key available, throw original error
    throw geminiError;
  }
}

async function processBatch(): Promise<void> {
  if (batchQueue.length === 0) return;

  const batch = batchQueue.splice(0, BATCH_SIZE);
  
  // Process batch items concurrently with retry logic
  const promises = batch.map(async ({ text, resolve, reject }) => {
    try {
      const result = await executeWithRetry(() => analyzeContentInternal(text));
      setCachedResult(text, result);
      resolve(result);
    } catch (error) {
      reject(error as Error);
    }
  });

  await Promise.allSettled(promises);

  // Process remaining items if any
  if (batchQueue.length > 0) {
    batchTimer = setTimeout(processBatch, BATCH_DELAY);
  } else {
    batchTimer = null;
  }
}

export async function analyzeContent(text: string): Promise<AnalysisResult> {
  // Check cache first
  const cachedResult = getCachedResult(text);
  if (cachedResult) {
    console.log('Returning cached result');
    return cachedResult;
  }

  // Add to batch queue
  return new Promise<AnalysisResult>((resolve, reject) => {
    batchQueue.push({ text, resolve, reject });

    // Start batch timer if not already running
    if (!batchTimer) {
      batchTimer = setTimeout(processBatch, BATCH_DELAY);
    }
  });
}
