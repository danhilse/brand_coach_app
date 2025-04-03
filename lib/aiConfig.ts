// AI configuration settings
export const aiConfig = {
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: "claude-3-7-sonnet-latest",
      maxTokens: 6000,
      temperature: 0.3,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o",
      maxTokens: 6000,
      temperature: 0.3,
    },
    gemini: {
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      model: "gemini-2.5-pro-latest",
      maxTokens: 6000,
      temperature: 0.3,
    },
    defaults: {
      provider: "anthropic" as "anthropic" | "openai" | "gemini",
      resultsLimit: 5,
    }
  }
  
  // Convenience function to check if an API is configured
  export function isProviderConfigured(provider: "anthropic" | "openai" | "gemini"): boolean {
    if (provider === "anthropic") {
      return Boolean(process.env.ANTHROPIC_API_KEY)
    } else if (provider === "openai") {
      return Boolean(process.env.OPENAI_API_KEY)
    } else if (provider === "gemini") {
      return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
    }
    return false
  }
  
  // Type definition for AI providers
  export type AIProvider = "anthropic" | "openai" | "gemini";