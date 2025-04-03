import type { AnalysisResult } from "./analyze-content"

export function getMockAnalysisResults(content: string, platform: string): AnalysisResult {
  // Generate some basic metrics based on content length for demo
  const contentLength = content.length
  const baseScore = Math.min(85, Math.max(55, 70 + (contentLength % 30) - 15))

  // Adjust tone balance based on platform
  let supportive = 50
  let challenging = 50

  switch (platform) {
    case "social":
    case "video":
      supportive = 10
      challenging = 90
      break
    case "blog":
      supportive = 30
      challenging = 70
      break
    case "email":
      supportive = 30
      challenging = 70
      break
    case "website":
    case "webinar":
    case "ebook":
    case "pr":
      supportive = 50
      challenging = 50
      break
    case "product":
    case "customer":
      supportive = 70
      challenging = 30
      break
    case "cs":
    case "connect":
      supportive = 90
      challenging = 10
      break
    default:
      supportive = 50
      challenging = 50
  }

  // Generate ICP scores
  const userBuyerScore = Math.min(100, Math.max(0, 50 + (contentLength % 50) - 25))
  const maturityScore = Math.min(100, Math.max(0, 50 + (contentLength % 40) - 20))

  // Determine primary persona based on scores
  let primaryPersona = ""
  if (userBuyerScore < 50) {
    if (maturityScore < 50) {
      primaryPersona = 'THE "GRADUATOR" USER'
    } else {
      primaryPersona = 'THE "DISENFRANCHISED" USER'
    }
  } else {
    if (maturityScore < 50) {
      primaryPersona = 'THE "GRADUATOR" BUYER'
    } else {
      primaryPersona = 'THE "DISENFRANCHISED" BUYER'
    }
  }

  // Add content recommendations
  const contentRecommendations = [
    {
      category: "Voice",
      priority: "High",
      title: "Adjust tone to be more refreshingly direct",
      description:
        "Replace corporate jargon with more conversational language that reflects Act-On's 'refreshingly direct' voice.",
      examples: [
        {
          original:
            "Our solution enables seamless integration with your existing tech stack to drive synergies across your marketing ecosystem.",
          improved:
            "Our platform works with your existing tools so your marketing team can get more done with less effort.",
          explanation:
            "Removes corporate jargon ('enables', 'seamless', 'synergies') and uses straightforward language that's more conversational and authentic.",
        },
        {
          original: "Leverage our actionable analytics to optimize campaign performance and maximize ROI.",
          improved: "See exactly what's working in your campaigns and make smart changes that boost your results.",
          explanation:
            "Replaces marketing buzzwords with clear, direct language that explains the benefit in simple terms.",
        },
      ],
    },
    {
      category: "Audience",
      priority: "Medium",
      title: `Better target the "${primaryPersona}" persona`,
      description: `Adjust content to address specific pain points and needs of the ${primaryPersona} persona.`,
      examples: [
        {
          original: "Our marketing automation platform offers comprehensive features for all your marketing needs.",
          improved: primaryPersona.includes("DISENFRANCHISED")
            ? "Tired of complex marketing platforms that promise everything but deliver headaches? Our focused approach gives you the power you need without the bloat you don't."
            : "New to marketing automation? Our platform makes it easy to start small and grow your capabilities as your team gains confidence.",
          explanation: primaryPersona.includes("DISENFRANCHISED")
            ? "Directly acknowledges the frustration with existing platforms while promising a more focused solution."
            : "Addresses the risk-averse nature of graduators by emphasizing ease of use and gradual adoption.",
        },
      ],
    },
    {
      category: "Messaging",
      priority: "High",
      title: "Incorporate 'Act-On Fuels Agile Marketing' pillar",
      description:
        "Add specific examples of how Act-On accelerates marketing programs and helps users go from idea to impact quickly.",
      examples: [
        {
          original: "Our platform helps marketers create and send campaigns.",
          improved:
            "Go from idea to impact in record time—create, launch, and measure campaigns while your competition is still in planning meetings.",
          explanation:
            "Incorporates the 'Act-On Fuels Agile Marketing' pillar by emphasizing speed and efficiency, using language directly from the messaging framework.",
        },
        {
          original: "Automate your marketing workflows to save time.",
          improved:
            "Unlock your team's potential by automating repetitive tasks, freeing them to focus on creative work that drives real business results.",
          explanation:
            "Uses language from the messaging pillar ('unlock your potential') and connects automation to business outcomes.",
        },
      ],
    },
    {
      category: platform,
      priority: "Medium",
      title: `Adjust tone balance for ${platform} content`,
      description: `${platform} content should have approximately ${supportive}% supportive / ${challenging}% challenging tone balance.`,
      examples: [
        {
          original:
            platform === "social" || platform === "video"
              ? "Our platform offers many helpful features for marketers looking to improve their campaigns."
              : "Challenge yourself to rethink everything you know about marketing automation!",
          improved:
            platform === "social" || platform === "video"
              ? "Ready to break free from marketing automation that holds you back? It's time to demand more."
              : "We're here to help you navigate the complexities of marketing automation with a platform designed around your needs.",
          explanation:
            platform === "social" || platform === "video"
              ? "Increases the challenging tone to match the 90% challenging / 10% supportive balance needed for social/video content."
              : "Softens the challenging tone to provide more support, better matching the platform's recommended tone balance.",
        },
      ],
    },
  ]

  return {
    voicePersonality: {
      analysis:
        "The content demonstrates a good understanding of Act-On's brand voice, with a refreshingly direct tone that avoids corporate jargon. There's a natural, conversational quality that aligns well with the brand guidelines, though there are opportunities to strengthen the 'Supportive Challenger' personality.",
      score: baseScore,
      toneBalance: {
        supportive,
        challenging,
      },
      strengths: [
        "Natural, conversational language that avoids corporate jargon",
        "Confident tone that reflects brand authenticity",
        "Good balance of professional and approachable language",
        "Uses inclusive language throughout",
      ],
      improvements: [
        "Could more explicitly challenge the reader to think differently",
        "Add more specific examples to demonstrate expertise",
        "Incorporate more of the 'White-Collar Mechanic' persona elements",
        "Adjust tone to better match the specific channel requirements",
      ],
      voiceAttributes: {
        "Natural & Straightforward": {
          score: baseScore + 5,
          feedback:
            "The content uses plain language and avoids jargon, speaking directly to the reader in a refreshing way.",
        },
        "Authentic & Approachable": {
          score: baseScore + 2,
          feedback: "Good balance of confidence without being arrogant, though could be more conversational in places.",
        },
        "Inclusive Language": {
          score: baseScore + 8,
          feedback: "Excellent use of inclusive language throughout, avoiding gendered terms and exclusionary phrases.",
        },
        "Channel Appropriateness": {
          score: baseScore - 5,
          feedback: `The tone could be better calibrated for ${platform} content, which typically requires a ${supportive}% supportive / ${challenging}% challenging balance.`,
        },
      },
    },
    targetAudience: {
      analysis:
        "The content shows awareness of Act-On's target audience profiles but could be more specifically tailored to address the unique pain points of either 'The Disenfranchised' or 'The Graduator' personas. There are good elements that would resonate with marketing professionals, but the messaging could be more precisely targeted.",
      score: baseScore - 3,
      primaryAudience: {
        type: primaryPersona,
        alignment: baseScore - 5,
        feedback: primaryPersona.includes("DISENFRANCHISED")
          ? "The content addresses some frustrations of experienced marketing automation users but could more directly speak to their specific pain points with current MAP providers."
          : "The content provides some guidance for those new to marketing automation but could better address the risk-averse nature of this audience and their need for education.",
      },
      audienceInsights: {
        strengths: [
          "Addresses professional marketing concerns that resonate with the target audience",
          "Uses language appropriate for marketing professionals",
          "Acknowledges the need for efficiency and ROI in marketing operations",
          "Recognizes the technical challenges faced by marketing teams",
        ],
        improvements: [
          "More directly address specific pain points of the primary persona",
          "Include more specific examples relevant to the audience's experience level",
          "Better acknowledge the audience's current situation and challenges",
          "Tailor solutions more precisely to the audience's maturity level",
        ],
      },
      personaMatches: {
        'THE "DISENFRANCHISED" USER': {
          score: maturityScore > 50 && userBuyerScore < 50 ? baseScore + 10 : baseScore - 10,
          feedback:
            maturityScore > 50 && userBuyerScore < 50
              ? "Content addresses frustrations with existing platforms but could offer more specific solutions."
              : "Content doesn't sufficiently address the experienced user's specific pain points and frustrations.",
        },
        'THE "GRADUATOR" USER': {
          score: maturityScore < 50 && userBuyerScore < 50 ? baseScore + 10 : baseScore - 10,
          feedback:
            maturityScore < 50 && userBuyerScore < 50
              ? "Content provides good introductory context but could offer more educational elements."
              : "Content assumes too much prior knowledge for users new to marketing automation.",
        },
        'THE "DISENFRANCHISED" BUYER': {
          score: maturityScore > 50 && userBuyerScore > 50 ? baseScore + 10 : baseScore - 10,
          feedback:
            maturityScore > 50 && userBuyerScore > 50
              ? "Addresses cost concerns but could better emphasize ROI and migration ease."
              : "Doesn't sufficiently address the cost pressures and ROI needs of this persona.",
        },
        'THE "GRADUATOR" BUYER': {
          score: maturityScore < 50 && userBuyerScore > 50 ? baseScore + 10 : baseScore - 10,
          feedback:
            maturityScore < 50 && userBuyerScore > 50
              ? "Provides some scaling context but could better address department-building concerns."
              : "Doesn't adequately address the department-building needs of this persona.",
        },
      },
      // Add ICP analysis data
      icpAnalysis: {
        userBuyerScore,
        maturityScore,
        primaryPersona,
      },
    },
    messagingValues: {
      analysis:
        "The content incorporates some elements of Act-On's messaging framework but doesn't fully leverage the three key pillars: 'Act-On Fuels Agile Marketing,' 'Innovative Solutions for Innovative Marketers,' and 'Your Partner in Marketing Success.' There's room to more explicitly align with these core messages and demonstrate the brand values.",
      score: baseScore - 7,
      keyThemes: {
        present: ["Marketing efficiency", "Automation benefits", "Professional support", "Technical expertise"],
        missing: ["Agile marketing emphasis", "Innovation focus", "Partnership approach", "Business growth outcomes"],
      },
      messagingPillars: {
        "Act-On Fuels Agile Marketing": {
          score: baseScore - 10,
          feedback:
            "The content touches on efficiency but doesn't strongly emphasize how Act-On accelerates marketing programs or helps users go from idea to impact quickly.",
          examples: [
            "Reference to streamlining workflows could be expanded to emphasize agility",
            "Mention of time savings could be connected more directly to business results",
          ],
        },
        "Innovative Solutions for Innovative Marketers": {
          score: baseScore - 5,
          feedback:
            "Some references to technology capabilities, but doesn't strongly position Act-On as an innovative platform or emphasize how it helps marketers stay ahead of competitors.",
          examples: [
            "Brief mention of analytics could be expanded to highlight innovative capabilities",
            "Reference to automation could emphasize cutting-edge approaches",
          ],
        },
        "Your Partner in Marketing Success": {
          score: baseScore,
          feedback:
            "The content does a better job conveying Act-On as a supportive partner, though it could more explicitly emphasize the knowledgeable support team and professional services ecosystem.",
          examples: ["Good emphasis on support availability", "References to expertise that help build confidence"],
        },
      },
      valueAlignment: {
        "Put People First": {
          score: baseScore + 5,
          feedback:
            "Good demonstration of empathy and human connection, though could more explicitly show how Act-On invests in customer relationships.",
        },
        "Be Yourself": {
          score: baseScore,
          feedback:
            "The authentic tone aligns with this value, but could more explicitly encourage authenticity in marketing approaches.",
        },
        "Do Your Best (Together)": {
          score: baseScore - 8,
          feedback:
            "Limited emphasis on collaboration and collective excellence; could better demonstrate how Act-On facilitates teamwork.",
        },
        "Make It Better": {
          score: baseScore - 3,
          feedback:
            "Some references to improvement and innovation, but could more strongly emphasize continuous growth and creative problem-solving.",
        },
      },
    },
    overall: {
      analysis:
        "The content demonstrates partial alignment with Act-On's brand guidelines, with strengths in voice and tone but opportunities to improve in audience targeting and messaging framework alignment. The natural, conversational language works well, but the content could more explicitly leverage the key messaging pillars and better address the specific needs of the target personas.",
      score: baseScore - 5,
      summary:
        "This content achieves moderate alignment with Act-On's brand guidelines. It successfully adopts a refreshingly direct tone and avoids corporate jargon, but doesn't fully leverage the messaging framework or target specific audience personas with precision. With some refinements to strengthen the 'Supportive Challenger' personality and more explicitly incorporate key messaging pillars, this content could better represent the Act-On brand.",
      strengths: [
        "Natural, conversational language that avoids corporate jargon",
        "Good use of inclusive language throughout",
        "Professional yet approachable tone",
        "Some elements of the 'Your Partner in Marketing Success' pillar",
      ],
      improvements: [
        "More explicitly incorporate the three key messaging pillars",
        "Better target the specific needs and pain points of primary personas",
        "Strengthen the 'Supportive Challenger' personality elements",
        "Adjust tone balance to better match platform-specific guidelines",
      ],
      recommendations: [
        {
          priority: "High",
          action: "Incorporate more 'Act-On Fuels Agile Marketing' messaging",
          explanation:
            "Add specific examples of how Act-On accelerates marketing programs and helps users go from idea to impact quickly. Emphasize time savings and business results.",
        },
        {
          priority: "High",
          action: `Adjust tone balance for ${platform} content`,
          explanation: `${platform} content should have approximately ${supportive}% supportive / ${challenging}% challenging tone balance. Review content to ensure it matches this guideline.`,
        },
        {
          priority: "Medium",
          action: "Add more specific persona-targeted content",
          explanation: primaryPersona.includes("DISENFRANCHISED")
            ? "Focus more on addressing the specific frustrations of 'The Disenfranchised' persona, particularly around their disappointment with current MAP providers."
            : "Provide more educational content and reassurance for 'The Graduator' persona, acknowledging their risk-averse nature.",
        },
        {
          priority: "Medium",
          action: "Strengthen 'White-Collar Mechanic' personality elements",
          explanation:
            "Add more technical details and examples that demonstrate hands-on expertise while maintaining professional polish.",
        },
        {
          priority: "Low",
          action: "Incorporate more brand values",
          explanation:
            "Look for opportunities to demonstrate the 'Do Your Best (Together)' and 'Make It Better' values through examples of collaboration and continuous improvement.",
        },
      ],
    },
    contentRecommendations, // Add this new property
  }
}

