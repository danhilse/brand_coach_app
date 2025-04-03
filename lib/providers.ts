// lib/providers.ts
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';

// Type for our supported AI providers
export type AIProvider = "anthropic" | "openai" | "gemini";

// AI configuration settings
export const aiConfig = {
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY as string,
    model: "claude-3-7-sonnet-latest",
    maxTokens: 6000,
    temperature: 0.3,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY as string,
    model: "gpt-4o",
    maxTokens: 6000,
    temperature: 0.3,
  },
  gemini: {
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY as string,
    // Keep the model name consistent with your other app
    model: "gemini-2.5-pro-exp-03-25", // Try this if gemini-2.5-pro-latest doesn't work
    maxTokens: 6000,
    temperature: 0.3,
  },
  defaults: {
    provider: "anthropic" as AIProvider,
  }
};

// Helper function to get the appropriate model for each provider
export async function getAIResponse(
  provider: AIProvider, 
  prompt: string
): Promise<string> {
  try {
    console.log(`Starting getAIResponse for provider: ${provider}`);
    
    // Check API keys before proceeding
    if (!process.env.ANTHROPIC_API_KEY && provider === 'anthropic') {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
    }
    
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && provider === 'gemini') {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set in environment variables');
    }
    
    if (!process.env.OPENAI_API_KEY && provider === 'openai') {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    
    let result;
    
    if (provider === 'anthropic') {
      console.log('Using Anthropic provider');
      result = await generateText({
        model: anthropic(aiConfig.anthropic.model),
        prompt,
        maxTokens: aiConfig.anthropic.maxTokens,
        temperature: aiConfig.anthropic.temperature,
      });
    } 
    else if (provider === 'gemini') {
      console.log('Using Google Gemini provider');
      // Try using exact same pattern as in your other app
      result = await generateText({
        model: google(aiConfig.gemini.model),
        prompt,
        maxTokens: aiConfig.gemini.maxTokens,
        temperature: aiConfig.gemini.temperature,
      });
    } 
    else if (provider === 'openai') {
      console.log('Using OpenAI provider');
      result = await generateText({
        model: openai(aiConfig.openai.model),
        prompt,
        maxTokens: aiConfig.openai.maxTokens,
        temperature: aiConfig.openai.temperature,
      });
    } 
    else {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    
    console.log(`Successfully got response from ${provider}`);
    return result.text;
  } catch (error) {
    console.error(`Error using ${provider} provider:`, error);
    // Add more details to help with debugging
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Rethrow with more context
    if (error instanceof Error) {
      throw new Error(`${provider} API Error: ${error.message}`);
    } else {
      throw new Error(`${provider} API Error: Unknown error`);
    }
  }
}

// Convenience function to check if an API is configured
export function isProviderConfigured(provider: AIProvider): boolean {
  if (provider === "anthropic") {
    return Boolean(process.env.ANTHROPIC_API_KEY);
  } else if (provider === "openai") {
    return Boolean(process.env.OPENAI_API_KEY);
  } else if (provider === "gemini") {
    return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  }
  return false;
}