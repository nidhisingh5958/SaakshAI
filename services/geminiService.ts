
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Note: The API key must be obtained exclusively from the environment variable process.env.API_KEY.

const analysisSchema = {
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

export async function analyzeContent(text: string): Promise<AnalysisResult> {
  // Use process.env.API_KEY directly as per SDK requirements.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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

  // Upgraded model to gemini-3-pro-preview for complex reasoning tasks.
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: analysisSchema,
      temperature: 0.1, // High precision for analysis
    },
  });

  // Extract text using the .text property as per guidelines.
  const resultText = response.text || "{}";
  return JSON.parse(resultText);
}
