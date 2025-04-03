import { ContentRecommendation } from "@/lib/analyze-content";

export function getMockRecommendations(content: string, platform: string): ContentRecommendation[] {
  // Get a few excerpts from the content to use in recommendations
  const contentExcerpts = getContentExcerpts(content);
  
  // Create mock recommendations based on platform and content
  return [
    {
      category: "Voice",
      priority: "High",
      title: "Enhance supportive tone for better audience connection",
      description: "The content tone is more challenging than optimal for this platform. Adjust phrasing to be more supportive and encouraging.",
      examples: [
        {
          original: contentExcerpts[0] || "You should implement these features to improve results.",
          improved: contentExcerpts[0] ? 
            contentExcerpts[0].replace(/should|must|need to/gi, "can") : 
            "You can implement these features to improve results.",
          explanation: "Using 'can' instead of 'should' creates a more supportive tone that empowers the reader rather than dictating actions."
        }
      ]
    },
    {
      category: "Audience",
      priority: "Medium",
      title: "Tailor content to primary audience needs",
      description: `Refine messaging to better align with the needs of ${platform === 'website' ? 'The Graduator User' : 'The Disenfranchised Buyer'} persona.`,
      examples: [
        {
          original: contentExcerpts[1] || "Our solution provides advanced features for experienced users.",
          improved: platform === 'website' ? 
            (contentExcerpts[1] ? contentExcerpts[1].replace(/advanced|experienced/gi, "intuitive") : "Our solution provides intuitive features that are easy to implement.") : 
            (contentExcerpts[1] ? contentExcerpts[1].replace(/solution provides/gi, "solution saves you time with") : "Our solution saves you time with advanced features for experienced users."),
          explanation: platform === 'website' ? 
            "Graduator Users need reassurance about ease of use rather than advanced capabilities." : 
            "Disenfranchised Buyers are focused on efficiency and time savings."
        }
      ]
    },
    {
      category: "Messaging",
      priority: "Low",
      title: "Strengthen value proposition alignment",
      description: "Incorporate key messaging pillars that are currently underrepresented in the content.",
      examples: [
        {
          original: contentExcerpts[2] || "Our marketing platform delivers results.",
          improved: contentExcerpts[2] ? 
            contentExcerpts[2].replace(/delivers results/gi, "fuels agile marketing strategies") : 
            "Our marketing platform fuels agile marketing strategies that adapt to your evolving needs.",
          explanation: "This revised phrasing directly incorporates the 'Act-On Fuels Agile Marketing' messaging pillar."
        }
      ]
    },
    {
      category: platform,
      priority: "Medium",
      title: `Optimize for ${platform} engagement patterns`,
      description: `Adjust content structure and formatting to better match ${platform} user expectations and engagement patterns.`,
      examples: [
        {
          original: contentExcerpts[3] || "Contact us to learn more about our platform's capabilities.",
          improved: platform === 'email' ? 
            "Click here to see how our platform can transform your marketing results in just 30 days." : 
            (platform === 'social' ? 
              "Ready to transform your marketing? Drop a comment or DM us to learn how! #MarketingTransformation" : 
              "Schedule a personalized demo to see how our platform can address your specific marketing challenges."),
          explanation: `This revised call-to-action is more aligned with ${platform} user expectations and provides a clearer next step.`
        }
      ]
    }
  ];
}

// Helper function to extract excerpts from the content
function getContentExcerpts(content: string): string[] {
  // Split content into sentences
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
  
  // Get up to 4 sentences that are between 5 and 15 words long
  const excerpts: string[] = [];
  for (const sentence of sentences) {
    const wordCount = sentence.trim().split(/\s+/).length;
    if (wordCount >= 5 && wordCount <= 15) {
      excerpts.push(sentence.trim());
      if (excerpts.length >= 4) break;
    }
  }
  
  // If we don't have enough excerpts, add some of the remaining sentences
  if (excerpts.length < 4 && sentences.length > 0) {
    for (let i = 0; i < sentences.length && excerpts.length < 4; i++) {
      if (!excerpts.includes(sentences[i].trim())) {
        excerpts.push(sentences[i].trim());
      }
    }
  }
  
  return excerpts;
}