// api/claude/route.ts

import { NextResponse } from "next/server"
import { brandGuidelines } from "@/lib/brand-guidelines"

export async function POST(request: Request) {
  try {
    const { content, platform } = await request.json()

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Call the Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-7-sonnet-latest",
        max_tokens: 6000,
        temperature: 0.3,
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
            
            Ensure your response is ONLY the JSON object with no additional text or markdown formatting.`,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Claude API error:", errorData)
      return NextResponse.json({ error: "Error from Claude API" }, { status: response.status })
    }

    const claudeData = await response.json()

    // Extract the content from Claude's response
    let analysisResults

    try {
      // Claude 3.5 returns a content array with text
      if (claudeData.content && Array.isArray(claudeData.content)) {
        const contentText = claudeData.content[0].text

        // Try to parse the JSON directly
        try {
          analysisResults = JSON.parse(contentText)
        } catch (e) {
          // If direct parsing fails, try to extract JSON from markdown code block
          const jsonMatch = contentText.match(/```(?:json)?\n?([\s\S]*?)\n?```/)
          if (jsonMatch) {
            analysisResults = JSON.parse(jsonMatch[1])
          } else {
            throw new Error("Could not parse JSON from Claude response")
          }
        }
      } else {
        throw new Error("Unexpected response format from Claude API")
      }
    } catch (error) {
      console.error("Error parsing Claude response:", error, claudeData)
      return NextResponse.json({ error: "Failed to parse Claude response" }, { status: 500 })
    }

    return NextResponse.json(analysisResults)
  } catch (error) {
    console.error("Error calling Claude API:", error)
    return NextResponse.json({ error: "Failed to analyze content with Claude" }, { status: 500 })
  }
}

