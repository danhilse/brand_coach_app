// lib/generate-improved.ts
import { AIProvider, getAIResponse } from './providers';
import { AnalysisResult, ContentRecommendation } from './analyze-content';
import { brandGuidelinesForLLM } from './brand-guidelines-optimized';

// Step 1: Generate the content analysis without recommendations
export async function generateAnalysis(
  provider: AIProvider,
  content: string,
  platform: string
): Promise<Omit<AnalysisResult, 'contentRecommendations'>> {
  try {
    // Convert brandGuidelinesForLLM to a string
    const brandGuidelinesStr = JSON.stringify(brandGuidelinesForLLM, null, 2);
    
    // Determine the expected tone balance based on platform
    let expectedToneBalance = { supportive: 50, challenging: 50 }; // Default balance
    
    // Try to match the platform to one of the channels in the tone spectrum
    for (const spectrum of brandGuidelinesForLLM.voice.toneSpectrum) {
      const matchingChannel = spectrum.channels.find(
        channel => channel.toLowerCase() === platform.toLowerCase()
      );
      
      if (matchingChannel) {
        expectedToneBalance = spectrum.balance;
        break;
      }
    }
    
    const prompt = `# Task: Marketing Content Brand Alignment Analysis

## Context
You are an expert marketing brand consultant analyzing content for Act-On, a marketing automation platform. Your task is to evaluate how well the provided marketing content aligns with Act-On's brand guidelines.

## Brand Guidelines
${brandGuidelinesStr}

## Content Details
- PLATFORM/CHANNEL: ${platform}
- EXPECTED TONE BALANCE: ${expectedToneBalance.challenging}% challenging, ${expectedToneBalance.supportive}% supportive

## Content to Analyze
\`\`\`
${content}
\`\`\`

## Analysis Instructions
1. Carefully read the content and compare it against Act-On's brand guidelines
2. Evaluate across all dimensions: voice, tone, audience targeting, and messaging alignment
3. Provide specific examples from the text to support your evaluation
4. Score each dimension on a scale of 0-100 based on the following criteria:
   - 90-100: Exemplary alignment with brand guidelines
   - 70-89: Strong alignment with minor improvements possible
   - 50-69: Moderate alignment with several areas for improvement
   - 30-49: Limited alignment with significant improvements needed
   - 0-29: Poor alignment requiring complete revision

## Output Format
Provide your analysis in the following JSON format with NO additional text:

{
  "voicePersonality": {
    "analysis": "Overall analysis of voice and tone - be specific about how the content's voice aligns with the 'Refreshingly Direct' voice and the appropriate balance of 'Supportive Challenger' and 'White-Collar Mechanic' personalities",
    "score": [0-100 as integer],
    "toneBalance": {
      "supportive": [0-100 as integer representing how supportive the tone is],
      "challenging": [0-100 as integer representing how challenging the tone is]
    },
    "strengths": ["Specific strength with example from the content", "Another strength with example"],
    "improvements": ["Specific improvement with example from the content", "Another improvement with example"],
    "voiceAttributes": {
      "Natural and Conversational": {
        "score": [0-100],
        "feedback": "Specific feedback with examples from the content"
      },
      "Authentic and Approachable": {
        "score": [0-100],
        "feedback": "Specific feedback with examples from the content"
      },
      "Gender-Neutral and Inclusive": {
        "score": [0-100],
        "feedback": "Specific feedback with examples from the content"
      },
      "Appropriately Tailored to Channel": {
        "score": [0-100],
        "feedback": "Specific feedback about tone appropriateness for this specific channel"
      }
    }
  },
  "targetAudience": {
    "analysis": "Overall analysis of how well the content addresses Act-On's target audiences",
    "score": [0-100],
    "primaryAudience": {
      "type": "Identify the primary audience this content targets (Disenfranchised User, Graduator User, Disenfranchised Buyer, or Graduator Buyer)",
      "alignment": [0-100],
      "feedback": "Explain why you identified this audience and how well the content speaks to them"
    },
    "audienceInsights": {
      "strengths": ["Specific strength with example", "Another strength with example"],
      "improvements": ["Specific improvement with example", "Another improvement with example"]
    },
    "personaMatches": {
      "The Disenfranchised User": {
        "score": [0-100],
        "feedback": "Evaluation of how the content resonates with this persona, with examples"
      },
      "The Graduator User": {
        "score": [0-100],
        "feedback": "Evaluation of how the content resonates with this persona, with examples"
      },
      "The Disenfranchised Buyer": {
        "score": [0-100],
        "feedback": "Evaluation of how the content resonates with this persona, with examples"
      },
      "The Graduator Buyer": {
        "score": [0-100],
        "feedback": "Evaluation of how the content resonates with this persona, with examples"
      }
    }
  },
  "messagingValues": {
    "analysis": "Overall analysis of messaging alignment with Act-On's key pillars and values",
    "score": [0-100],
    "keyThemes": {
      "present": ["Specific theme from guidelines present in content with example", "Another theme with example"],
      "missing": ["Important theme missing from content", "Another missing theme"]
    },
    "messagingPillars": {
      "Act-On Fuels Agile Marketing": {
        "score": [0-100],
        "feedback": "Evaluation of how well the content incorporates this pillar",
        "examples": ["Example from content that reflects this pillar", "Another example if available"]
      },
      "Innovative Solutions for Innovative Marketers": {
        "score": [0-100],
        "feedback": "Evaluation of how well the content incorporates this pillar",
        "examples": ["Example from content that reflects this pillar", "Another example if available"]
      },
      "Your Partner in Marketing Success": {
        "score": [0-100],
        "feedback": "Evaluation of how well the content incorporates this pillar",
        "examples": ["Example from content that reflects this pillar", "Another example if available"]
      }
    },
    "valueAlignment": {
      "Put People First": {
        "score": [0-100],
        "feedback": "Evaluation of how well the content reflects this value, with examples"
      },
      "Be Yourself": {
        "score": [0-100],
        "feedback": "Evaluation of how well the content reflects this value, with examples"
      },
      "Do Your Best (Together)": {
        "score": [0-100],
        "feedback": "Evaluation of how well the content reflects this value, with examples"
      },
      "Make It Better": {
        "score": [0-100],
        "feedback": "Evaluation of how well the content reflects this value, with examples"
      }
    }
  },
  "overall": {
    "analysis": "Comprehensive analysis of brand alignment",
    "score": [0-100],
    "summary": "Executive summary highlighting key findings",
    "strengths": ["Major strength with supporting example", "Another major strength with example"],
    "improvements": ["Critical improvement area with example", "Another improvement area with example"],
    "recommendations": [
      {
        "priority": "High/Medium/Low",
        "action": "Specific, actionable recommendation",
        "explanation": "Explanation of why this action matters for brand alignment"
      },
      {
        "priority": "High/Medium/Low",
        "action": "Another specific, actionable recommendation",
        "explanation": "Explanation of why this action matters for brand alignment"
      }
    ]
  }
}`;

    // Use the provider to get the response
    const text = await getAIResponse(provider, prompt);
    
    // Parse the JSON response
    let analysisResults;
    
    try {
      // Try to parse the JSON directly
      analysisResults = JSON.parse(text);
    } catch (e) {
      // If direct parsing fails, try to extract JSON from markdown code block
      const jsonMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        analysisResults = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Could not parse JSON from AI response");
      }
    }
    
    return analysisResults;
  } catch (error) {
    console.error("Error generating analysis:", error);
    throw error;
  }
}

// Step 2: Generate content recommendations based on the analysis
export async function generateRecommendations(
  provider: AIProvider,
  content: string,
  platform: string,
  analysis: Omit<AnalysisResult, 'contentRecommendations'>
): Promise<ContentRecommendation[]> {
  try {
    // Determine the most important areas for improvement
    const voiceScore = analysis.voicePersonality.score;
    const audienceScore = analysis.targetAudience.score;
    const messagingScore = analysis.messagingValues.score;
    
    // Find lowest scoring messaging pillars
    const lowScoringPillars = Object.entries(analysis.messagingValues.messagingPillars)
      .filter(([_, pillar]) => pillar.score < 70)
      .map(([name, pillar]) => ({ name, score: pillar.score }));
    
    // Find lowest scoring audience personas
    const lowScoringPersonas = Object.entries(analysis.targetAudience.personaMatches)
      .filter(([_, persona]) => persona.score < 70)
      .map(([name, persona]) => ({ name, score: persona.score }));
    
    // Extract platform's expected tone balance
    let expectedToneBalance = { supportive: 50, challenging: 50 }; // Default balance
    
    // Try to find the right balance from the brand guidelines
    for (const spectrum of brandGuidelinesForLLM.voice.toneSpectrum) {
      const matchingChannel = spectrum.channels.find(
        channel => channel.toLowerCase() === platform.toLowerCase()
      );
      
      if (matchingChannel) {
        expectedToneBalance = spectrum.balance;
        break;
      }
    }
    
    const prompt = `# Task: Generate Actionable Content Recommendations

## Context
You are an expert marketing brand consultant for Act-On, a marketing automation platform. You've analyzed a piece of marketing content and now need to provide specific, actionable recommendations to improve its alignment with Act-On's brand guidelines.

## Content Details
- PLATFORM/CHANNEL: ${platform}
- EXPECTED TONE BALANCE: ${expectedToneBalance.challenging}% challenging, ${expectedToneBalance.supportive}% supportive

## Original Content
\`\`\`
${content}
\`\`\`

## Analysis Summary
- Voice & Personality Score: ${voiceScore}/100
- Target Audience Score: ${audienceScore}/100
- Messaging & Values Score: ${messagingScore}/100

### Key Improvement Areas:
${voiceScore < 70 ? `- Voice/Tone needs significant improvement (${voiceScore}/100)` : ''}
${audienceScore < 70 ? `- Audience targeting needs significant improvement (${audienceScore}/100)` : ''}
${messagingScore < 70 ? `- Messaging alignment needs significant improvement (${messagingScore}/100)` : ''}
${lowScoringPillars.length > 0 ? `- Low-scoring messaging pillars: ${lowScoringPillars.map(p => p.name).join(', ')}` : ''}
${lowScoringPersonas.length > 0 ? `- Low-scoring audience personas: ${lowScoringPersonas.map(p => p.name).join(', ')}` : ''}

### Voice/Tone Improvements:
${analysis.voicePersonality.improvements.map(imp => `- ${imp}`).join('\n')}

### Audience Targeting Improvements:
${analysis.targetAudience.audienceInsights.improvements.map(imp => `- ${imp}`).join('\n')}

### Messaging Improvements:
- Missing themes: ${analysis.messagingValues.keyThemes.missing.join(', ')}
${analysis.overall.improvements.map(imp => `- ${imp}`).join('\n')}

## Recommendation Instructions
1. Create 3-5 high-impact, actionable recommendations that would most improve the content's brand alignment
2. Prioritize recommendations based on:
   - Impact on overall brand alignment
   - Severity of the issue
   - Ease of implementation
3. For each recommendation, provide:
   - A clear category (Voice/Tone, Audience Targeting, Messaging, or Platform-Specific)
   - A priority level (High/Medium/Low)
   - A specific, actionable title
   - A detailed description of the recommendation
   - Concrete examples showing original text and how it could be improved
4. Ensure examples use ACTUAL TEXT from the original content
5. Focus on substantive improvements, not just superficial wording changes

## Output Format
Provide your recommendations in the following JSON format with NO additional text:

[
  {
    "category": "Voice/Audience/Messaging/Platform",
    "priority": "High/Medium/Low",
    "title": "Clear, specific recommendation title",
    "description": "Detailed explanation of the recommendation and how it improves brand alignment",
    "examples": [
      {
        "original": "Exact text from the original content that needs improvement",
        "improved": "Rewritten version that better aligns with brand guidelines",
        "explanation": "Explanation of how the improved version better aligns with specific brand guideline elements"
      },
      {
        "original": "Another example of text needing improvement",
        "improved": "Better version aligned with guidelines",
        "explanation": "Explanation of improvements"
      }
    ]
  },
  {
    "category": "Another category",
    "priority": "Priority level",
    "title": "Another recommendation title",
    "description": "Description of recommendation",
    "examples": [
      {
        "original": "Original text",
        "improved": "Improved text",
        "explanation": "Explanation"
      }
    ]
  }
]`;

    // Use the provider to get the response
    const text = await getAIResponse(provider, prompt);
    
    // Parse the JSON response
    let recommendations: ContentRecommendation[];
    
    try {
      // Try to parse the JSON directly
      recommendations = JSON.parse(text);
    } catch (e) {
      // If direct parsing fails, try to extract JSON from markdown code block
      const jsonMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Could not parse JSON from recommendations response");
      }
    }
    
    return recommendations;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
}