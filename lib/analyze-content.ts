export interface ContentRewrite {
  original: string
  improved: string
  explanation: string
}

export interface ContentRecommendation {
  category: string
  priority: string
  title: string
  description: string
  examples: ContentRewrite[]
}

export interface AnalysisResult {
  voicePersonality: VoicePersonalityEvaluation
  targetAudience: TargetAudienceEvaluation
  messagingValues: MessagingValuesEvaluation
  overall: BrandEvaluation
  contentRecommendations: ContentRecommendation[]
}

export interface VoicePersonalityEvaluation {
  analysis: string
  score: number
  toneBalance: {
    supportive: number
    challenging: number
  }
  strengths: string[]
  improvements: string[]
  voiceAttributes: {
    [key: string]: {
      score: number
      feedback: string
    }
  }
}

export interface TargetAudienceEvaluation {
  analysis: string
  score: number
  primaryAudience: {
    type: string
    alignment: number
    feedback: string
  }
  audienceInsights: {
    strengths: string[]
    improvements: string[]
  }
  personaMatches: {
    [key: string]: {
      score: number
      feedback: string
    }
  }
  // Add ICP analysis data
  icpAnalysis?: {
    userBuyerScore: number
    maturityScore: number
    primaryPersona: string
  }
}

export interface MessagingValuesEvaluation {
  analysis: string
  score: number
  keyThemes: {
    present: string[]
    missing: string[]
  }
  messagingPillars: {
    [key: string]: {
      score: number
      feedback: string
      examples: string[]
    }
  }
  valueAlignment: {
    [key: string]: {
      score: number
      feedback: string
    }
  }
}

export interface BrandEvaluation {
  analysis: string
  score: number
  summary: string
  strengths: string[]
  improvements: string[]
  recommendations: {
    priority: string
    action: string
    explanation: string
  }[]
}

import { AIProvider, aiConfig } from "./providers";
import { brandGuidelines } from "../lib/brand-guidelines";
import { generateAnalysis, generateRecommendations } from "./generate";

export async function analyzeContent(
  content: string, 
  platform: string, 
  provider: AIProvider = aiConfig.defaults.provider
): Promise<Omit<AnalysisResult, 'contentRecommendations'>> {
  try {
    return await generateAnalysis(provider, content, platform);
  } catch (error) {
    console.error("Error analyzing content:", error);
    throw error;
  }
}

export async function generateContentRecommendations(
  content: string,
  platform: string,
  analysis: Omit<AnalysisResult, 'contentRecommendations'>,
  provider: AIProvider = aiConfig.defaults.provider
): Promise<ContentRecommendation[]> {
  try {
    return await generateRecommendations(provider, content, platform, analysis);
  } catch (error) {
    console.error("Error generating content recommendations:", error);
    throw error;
  }
}