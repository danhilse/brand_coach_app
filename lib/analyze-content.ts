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

import { brandGuidelines } from "@/lib/brand-guidelines";
import { aiConfig, AIProvider } from "@/lib/aiConfig";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

export async function analyzeContent(
  content: string, 
  platform: string, 
  provider: AIProvider = aiConfig.defaults.provider
): Promise<AnalysisResult> {
  // This function will be called server-side from /api/analyze
  try {
    switch (provider) {
      case "anthropic":
        return await analyzeWithAnthropic(content, platform);
      case "openai":
        return await analyzeWithOpenAI(content, platform);
      case "gemini":
        return await analyzeWithGemini(content, platform);
      default:
        return await analyzeWithAnthropic(content, platform);
    }
  } catch (error) {
    console.error(`Error calling ${provider} API:`, error);
    throw error;
  }
}

async function analyzeWithAnthropic(content: string, platform: string): Promise<AnalysisResult> {
  try {
    // Call the Anthropic API directly here
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: aiConfig.anthropic.model,
        max_tokens: aiConfig.anthropic.maxTokens,
        temperature: aiConfig.anthropic.temperature,
        messages: [
          {
            role: "user",
            content: `Analyze the following marketing content against Act-On's brand guidelines. 
            Evaluate the content across voice, tone, audience targeting, and messaging alignment.
            
            BRAND GUIDELINES:
            ${brandGuidelines}
            
            PLATFORM/CHANNEL: ${platform}
            
            CONTENT TO ANALYZE:
            ${content}
            
            Provide a detailed analysis in JSON format with the following structure:
            {
              "voicePersonality": {
                "analysis": "Overall analysis of voice and tone",
                "score": 0-100,
                "toneBalance": {
                  "supportive": 0-100,
                  "challenging": 0-100
                },
                "strengths": ["strength1", "strength2"],
                "improvements": ["improvement1", "improvement2"],
                "voiceAttributes": {
                  "attribute1": {
                    "score": 0-100,
                    "feedback": "Specific feedback"
                  }
                }
              },
              "targetAudience": {
                "analysis": "Overall analysis of audience targeting",
                "score": 0-100,
                "primaryAudience": {
                  "type": "The Disenfranchised or The Graduator",
                  "alignment": 0-100,
                  "feedback": "Specific feedback"
                },
                "audienceInsights": {
                  "strengths": ["strength1", "strength2"],
                  "improvements": ["improvement1", "improvement2"]
                },
                "personaMatches": {
                  "The Disenfranchised User": {
                    "score": 0-100,
                    "feedback": "Specific feedback"
                  },
                  "The Graduator User": {
                    "score": 0-100,
                    "feedback": "Specific feedback"
                  },
                  "The Disenfranchised Buyer": {
                    "score": 0-100,
                    "feedback": "Specific feedback"
                  },
                  "The Graduator Buyer": {
                    "score": 0-100,
                    "feedback": "Specific feedback"
                  }
                }
              },
              "messagingValues": {
                "analysis": "Overall analysis of messaging alignment",
                "score": 0-100,
                "keyThemes": {
                  "present": ["theme1", "theme2"],
                  "missing": ["theme1", "theme2"]
                },
                "messagingPillars": {
                  "Act-On Fuels Agile Marketing": {
                    "score": 0-100,
                    "feedback": "Specific feedback",
                    "examples": ["example1", "example2"]
                  },
                  "Innovative Solutions for Innovative Marketers": {
                    "score": 0-100,
                    "feedback": "Specific feedback",
                    "examples": ["example1", "example2"]
                  },
                  "Your Partner in Marketing Success": {
                    "score": 0-100,
                    "feedback": "Specific feedback",
                    "examples": ["example1", "example2"]
                  }
                },
                "valueAlignment": {
                  "Put People First": {
                    "score": 0-100,
                    "feedback": "Specific feedback"
                  },
                  "Be Yourself": {
                    "score": 0-100,
                    "feedback": "Specific feedback"
                  },
                  "Do Your Best (Together)": {
                    "score": 0-100,
                    "feedback": "Specific feedback"
                  },
                  "Make It Better": {
                    "score": 0-100,
                    "feedback": "Specific feedback"
                  }
                }
              },
              "overall": {
                "analysis": "Overall analysis of brand alignment",
                "score": 0-100,
                "summary": "Executive summary",
                "strengths": ["strength1", "strength2"],
                "improvements": ["improvement1", "improvement2"],
                "recommendations": [
                  {
                    "priority": "High/Medium/Low",
                    "action": "Specific action to take",
                    "explanation": "Explanation of why this action matters"
                  }
                ]
              },
              "contentRecommendations": [
                {
                  "category": "Voice/Audience/Messaging/Platform",
                  "priority": "High/Medium/Low",
                  "title": "Specific recommendation title",
                  "description": "Detailed description of the recommendation",
                  "examples": [
                    {
                      "original": "Example of original content text",
                      "improved": "Example of improved content text",
                      "explanation": "Explanation of why the improved version better aligns with brand guidelines"
                    }
                  ]
                }
              ]
            }
            
            Ensure your response is ONLY the JSON object with no additional text or markdown formatting.`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Claude API error:", errorData);
      throw new Error(`Error from Claude API: ${response.status}`);
    }

    const claudeData = await response.json();
    let analysisResults;

    try {
      // Claude 3.5 returns a content array with text
      if (claudeData.content && Array.isArray(claudeData.content)) {
        const contentText = claudeData.content[0].text;

        // Try to parse the JSON directly
        try {
          analysisResults = JSON.parse(contentText);
        } catch (e) {
          // If direct parsing fails, try to extract JSON from markdown code block
          const jsonMatch = contentText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
          if (jsonMatch) {
            analysisResults = JSON.parse(jsonMatch[1]);
          } else {
            throw new Error("Could not parse JSON from Claude response");
          }
        }
      } else {
        throw new Error("Unexpected response format from Claude API");
      }
      
      return analysisResults;
    } catch (error) {
      console.error("Error parsing Claude response:", error);
      throw new Error("Failed to parse Claude response");
    }
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw error;
  }
}

async function analyzeWithOpenAI(content: string, platform: string): Promise<AnalysisResult> {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    const response = await openai.chat.completions.create({
      model: aiConfig.openai.model,
      messages: [
        {
          role: "user",
          content: `Analyze the following marketing content against Act-On's brand guidelines. 
          Evaluate the content across voice, tone, audience targeting, and messaging alignment.
          
          BRAND GUIDELINES:
          ${brandGuidelines}
          
          PLATFORM/CHANNEL: ${platform}
          
          CONTENT TO ANALYZE:
          ${content}
          
          Provide a detailed analysis in JSON format with the following structure:
          {
            "voicePersonality": {
              "analysis": "Overall analysis of voice and tone",
              "score": 0-100,
              "toneBalance": {
                "supportive": 0-100,
                "challenging": 0-100
              },
              "strengths": ["strength1", "strength2"],
              "improvements": ["improvement1", "improvement2"],
              "voiceAttributes": {
                "attribute1": {
                  "score": 0-100,
                  "feedback": "Specific feedback"
                }
              }
            },
            "targetAudience": {
              "analysis": "Overall analysis of audience targeting",
              "score": 0-100,
              "primaryAudience": {
                "type": "The Disenfranchised or The Graduator",
                "alignment": 0-100,
                "feedback": "Specific feedback"
              },
              "audienceInsights": {
                "strengths": ["strength1", "strength2"],
                "improvements": ["improvement1", "improvement2"]
              },
              "personaMatches": {
                "The Disenfranchised User": {
                  "score": 0-100,
                  "feedback": "Specific feedback"
                },
                "The Graduator User": {
                  "score": 0-100,
                  "feedback": "Specific feedback"
                },
                "The Disenfranchised Buyer": {
                  "score": 0-100,
                  "feedback": "Specific feedback"
                },
                "The Graduator Buyer": {
                  "score": 0-100,
                  "feedback": "Specific feedback"
                }
              }
            },
            "messagingValues": {
              "analysis": "Overall analysis of messaging alignment",
              "score": 0-100,
              "keyThemes": {
                "present": ["theme1", "theme2"],
                "missing": ["theme1", "theme2"]
              },
              "messagingPillars": {
                "Act-On Fuels Agile Marketing": {
                  "score": 0-100,
                  "feedback": "Specific feedback",
                  "examples": ["example1", "example2"]
                },
                "Innovative Solutions for Innovative Marketers": {
                  "score": 0-100,
                  "feedback": "Specific feedback",
                  "examples": ["example1", "example2"]
                },
                "Your Partner in Marketing Success": {
                  "score": 0-100,
                  "feedback": "Specific feedback",
                  "examples": ["example1", "example2"]
                }
              },
              "valueAlignment": {
                "Put People First": {
                  "score": 0-100,
                  "feedback": "Specific feedback"
                },
                "Be Yourself": {
                  "score": 0-100,
                  "feedback": "Specific feedback"
                },
                "Do Your Best (Together)": {
                  "score": 0-100,
                  "feedback": "Specific feedback"
                },
                "Make It Better": {
                  "score": 0-100,
                  "feedback": "Specific feedback"
                }
              }
            },
            "overall": {
              "analysis": "Overall analysis of brand alignment",
              "score": 0-100,
              "summary": "Executive summary",
              "strengths": ["strength1", "strength2"],
              "improvements": ["improvement1", "improvement2"],
              "recommendations": [
                {
                  "priority": "High/Medium/Low",
                  "action": "Specific action to take",
                  "explanation": "Explanation of why this action matters"
                }
              ]
            },
            "contentRecommendations": [
              {
                "category": "Voice/Audience/Messaging/Platform",
                "priority": "High/Medium/Low",
                "title": "Specific recommendation title",
                "description": "Detailed description of the recommendation",
                "examples": [
                  {
                    "original": "Example of original content text",
                    "improved": "Example of improved content text",
                    "explanation": "Explanation of why the improved version better aligns with brand guidelines"
                  }
                ]
              }
            ]
          }
          
          Ensure your response is ONLY the JSON object with no additional text or markdown formatting.`
        }
      ],
      max_tokens: aiConfig.openai.maxTokens,
      temperature: aiConfig.openai.temperature,
      response_format: { type: "json_object" }
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error("Empty response from OpenAI API");
    }

    return JSON.parse(responseContent);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}

async function analyzeWithGemini(content: string, platform: string): Promise<AnalysisResult> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: aiConfig.gemini.model,
    });

    const prompt = `Analyze the following marketing content against Act-On's brand guidelines. 
    Evaluate the content across voice, tone, audience targeting, and messaging alignment.
    
    BRAND GUIDELINES:
    ${brandGuidelines}
    
    PLATFORM/CHANNEL: ${platform}
    
    CONTENT TO ANALYZE:
    ${content}
    
    Provide a detailed analysis in JSON format with the following structure:
    {
      "voicePersonality": {
        "analysis": "Overall analysis of voice and tone",
        "score": 0-100,
        "toneBalance": {
          "supportive": 0-100,
          "challenging": 0-100
        },
        "strengths": ["strength1", "strength2"],
        "improvements": ["improvement1", "improvement2"],
        "voiceAttributes": {
          "attribute1": {
            "score": 0-100,
            "feedback": "Specific feedback"
          }
        }
      },
      "targetAudience": {
        "analysis": "Overall analysis of audience targeting",
        "score": 0-100,
        "primaryAudience": {
          "type": "The Disenfranchised or The Graduator",
          "alignment": 0-100,
          "feedback": "Specific feedback"
        },
        "audienceInsights": {
          "strengths": ["strength1", "strength2"],
          "improvements": ["improvement1", "improvement2"]
        },
        "personaMatches": {
          "The Disenfranchised User": {
            "score": 0-100,
            "feedback": "Specific feedback"
          },
          "The Graduator User": {
            "score": 0-100,
            "feedback": "Specific feedback"
          },
          "The Disenfranchised Buyer": {
            "score": 0-100,
            "feedback": "Specific feedback"
          },
          "The Graduator Buyer": {
            "score": 0-100,
            "feedback": "Specific feedback"
          }
        }
      },
      "messagingValues": {
        "analysis": "Overall analysis of messaging alignment",
        "score": 0-100,
        "keyThemes": {
          "present": ["theme1", "theme2"],
          "missing": ["theme1", "theme2"]
        },
        "messagingPillars": {
          "Act-On Fuels Agile Marketing": {
            "score": 0-100,
            "feedback": "Specific feedback",
            "examples": ["example1", "example2"]
          },
          "Innovative Solutions for Innovative Marketers": {
            "score": 0-100,
            "feedback": "Specific feedback",
            "examples": ["example1", "example2"]
          },
          "Your Partner in Marketing Success": {
            "score": 0-100,
            "feedback": "Specific feedback",
            "examples": ["example1", "example2"]
          }
        },
        "valueAlignment": {
          "Put People First": {
            "score": 0-100,
            "feedback": "Specific feedback"
          },
          "Be Yourself": {
            "score": 0-100,
            "feedback": "Specific feedback"
          },
          "Do Your Best (Together)": {
            "score": 0-100,
            "feedback": "Specific feedback"
          },
          "Make It Better": {
            "score": 0-100,
            "feedback": "Specific feedback"
          }
        }
      },
      "overall": {
        "analysis": "Overall analysis of brand alignment",
        "score": 0-100,
        "summary": "Executive summary",
        "strengths": ["strength1", "strength2"],
        "improvements": ["improvement1", "improvement2"],
        "recommendations": [
          {
            "priority": "High/Medium/Low",
            "action": "Specific action to take",
            "explanation": "Explanation of why this action matters"
          }
        ]
      },
      "contentRecommendations": [
        {
          "category": "Voice/Audience/Messaging/Platform",
          "priority": "High/Medium/Low",
          "title": "Specific recommendation title",
          "description": "Detailed description of the recommendation",
          "examples": [
            {
              "original": "Example of original content text",
              "improved": "Example of improved content text",
              "explanation": "Explanation of why the improved version better aligns with brand guidelines"
            }
          ]
        }
      ]
    }
    
    Ensure your response is ONLY the JSON object with no additional text or markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Extract JSON from the response
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from Gemini response");
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}