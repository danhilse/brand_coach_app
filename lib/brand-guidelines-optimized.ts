// lib/brand-guidelines-optimized.ts

export const brandGuidelinesForLLM = {
    // Core Identity
    "identity": {
      "values": [
        {
          "name": "Put People First",
          "description": "Lead with human connection and relationship. Practice respect, empathy and open communication. Consider and invest in all Act-On stakeholders: team members, customers, vendors and business partners alike."
        },
        {
          "name": "Be Yourself",
          "description": "Embrace authenticity and honesty. Show up with your whole self – experiences, perspectives and humanity – and make room for others to do the same."
        },
        {
          "name": "Do Your Best (Together)",
          "description": "Commit to excellence, integrity and outcomes. Engage in dynamic collaboration, formulate plans with focus and act with urgency. Inspire and empower others."
        },
        {
          "name": "Make It Better",
          "description": "Champion innovation and growth. Think creatively, share your ideas and invite feedback. Celebrate collective accomplishments and learn from the disappointments. Meet tough problems head-on and challenge assumptions."
        }
      ]
    },
  
    // Brand Personality
    "personality": {
      "primary": {
        "name": "Supportive Challenger",
        "description": "We're here to support our customers every step of the way, while challenging them to push themselves to achieve more. Our platform and services are designed to help marketers go from idea to impact swiftly.",
        "attributes": [
          { "name": "Empathetic", "description": "We listen and provide personalized support." },
          { "name": "Encouraging", "description": "We inspire clients to think bigger and aim higher." },
          { "name": "Empowering", "description": "We provide tools and guidance for clients to take control." },
          { "name": "Proactive", "description": "We anticipate needs and offer solutions in advance." },
          { "name": "Innovative", "description": "We help clients embrace new ideas and technologies." }
        ]
      },
      "secondary": {
        "name": "White-Collar Mechanic",
        "description": "We pride ourselves on being hands-on experts, knowledgeable about the intricacies of marketing automation. Like a skilled mechanic, we understand the technical details and complexities, but we present ourselves with the polish and professionalism of a white-collar worker.",
        "attributes": [
          { "name": "Technically Proficient", "description": "We have a deep understanding of marketing automation." },
          { "name": "Detail-Oriented", "description": "We ensure all components work seamlessly." },
          { "name": "Professional", "description": "We maintain a polished and respectful demeanor." },
          { "name": "Reliable", "description": "Clients can count on us to be dependable." },
          { "name": "Approachable", "description": "We make complex concepts accessible and are friendly." }
        ]
      }
    },
  
    // Voice and Tone Guidelines
    "voice": {
      "overall": "Refreshingly Direct",
      "principles": [
        {
          "name": "Natural, conversational and straightforward",
          "description": "Our frank, conversational tone sets us apart as a brand that talks straight. We speak plainly, like we're the coolest person at the party with nothing to prove. It's not arrogance, but confidence, authenticity.",
          "avoid": ["seamless", "synergy", "enable", "align", "actionable"]
        },
        {
          "name": "Authentic & Approachable",
          "description": "The tone we use reflects confidence and ease; we know who we are and what we offer; we don't have to try too hard, because we are authentically ourselves. We use humor where appropriate, particularly to make dry topics more engaging, but we always stay professional when discussing serious topics that impact our audience's jobs and businesses."
        },
        {
          "name": "Gender-Neutral and Inclusive",
          "description": "We don't use any language that denigrates people based on their gender, background, or any other identity. Everyone is a part of our community, and we strive to be inclusive, for example, by using gender-neutral pronouns and removing racially-coded language.",
          "avoid": ["blacklist", "stand up", "guys", "master", "kill", "sexualized language"]
        },
        {
          "name": "Tailored to Channel and Content Type",
          "description": "Our new brand voice will come out more in some channels and content types than others. If we are overly \"challenging\" on all of our content, it may come across as aggressive and unwelcoming."
        }
      ],
      "toneSpectrum": [
        { 
          "balance": {"challenging": 10, "supportive": 90}, 
          "channels": ["CS TEAM", "CONNECT.ACT-ON.COM"]
        },
        { 
          "balance": {"challenging": 30, "supportive": 70}, 
          "channels": ["CUSTOMER MARKETING", "PRODUCT"]
        },
        { 
          "balance": {"challenging": 50, "supportive": 50}, 
          "channels": ["WEBINAR", "EBOOKS", "PR", "WEBSITE"]
        },
        { 
          "balance": {"challenging": 70, "supportive": 30}, 
          "channels": ["BLOGS", "EMAIL MKTG"]
        },
        { 
          "balance": {"challenging": 90, "supportive": 10}, 
          "channels": ["VIDEO", "SOCIAL", "ADVERTISING"]
        }
      ]
    },
  
    // Messaging Pillars
    "messaging": {
      "pillars": [
        {
          "name": "ACT-ON FUELS AGILE MARKETING",
          "points": [
            "Unlock your potential. Our intuitive platform accelerates marketing programs while measuring and driving business results.",
            "Go from idea to impact in record time. Create, measure, and refine your marketing efforts for maximum precision.",
            "Invest in your business' growth. Cut costs and drive ROI by eliminating time-consuming tasks that don't add value."
          ]
        },
        {
          "name": "INNOVATIVE SOLUTIONS FOR INNOVATIVE MARKETERS",
          "points": [
            "Generate demand and amplify your brand with all the features an enterprise marketing team needs.",
            "Leverage groundbreaking AI and Analytics. Expand your pipeline and convert customers with the most innovative marketing automation platform.",
            "Connect the dots faster to outpace your competitors. Make data-driven decisions backed by seamless integrations and a flexible data environment."
          ]
        },
        {
          "name": "YOUR PARTNER IN MARKETING SUCCESS AT EVERY STAGE",
          "points": [
            "Get quick support every time. Count on a knowledgeable support team that can quickly resolve any marketing challenge.",
            "Leverage resources and expertise to win. Unlock new possibilities through our extensive partner and professional services ecosystem.",
            "Pursue ambitious goals. Act confidently, knowing you're supported by an organization focused on helping marketers grow revenue."
          ]
        }
      ]
    },
  
    // Target Audience Profiles
    "targetAudiences": {
      "personas": [
        {
          "name": "THE DISENFRANCHISED USER",
          "description": "Experienced marketing automation user that's frustrated with their existing software platform. Looking for solutions that make their jobs easier.",
          "characteristics": [
            "Invested in top MAP providers behind the larger vision",
            "Lost faith in current MAP providers that require heavy resources",
            "Frustrated by the lack of progress against the original promise",
            "Have established processes and integrations"
          ],
          "roles": ["Director of Demand Gen", "Director of Mktg Operations", "Email Marketing Manager/Campaigns Manager", "Customer Marketing Manager"]
        },
        {
          "name": "THE GRADUATOR USER",
          "description": "A user that is new to marketing automation. They don't know what's possible since they haven't done it before, but they know what they want to do. Need software to achieve that desire, and education on how to use that software.",
          "characteristics": [
            "Business scale and maturity pushing them to evolve from Email Service Providers to Marketing Automation",
            "Seeking alternatives but extremely risk-averse",
            "Seeking a concierge-type partner to take them to entry-level Marketing Automation",
            "Likely being \"pushed\" to MA due to maturity needs and digital transformation"
          ]
        },
        {
          "name": "THE DISENFRANCHISED BUYER",
          "description": "Marketing leader that is replacing an existing marketing automation platform. They have to lower their lower costs due to budgetary pressure, and they have to prove marketing's ROI; migration is a point of friction.",
          "roles": ["CMO/VP of Marketing", "Director of Demand Generation", "Dir. of Mktg/Rev. Operations", "Director of Corp Marketing"]
        },
        {
          "name": "THE GRADUATOR BUYER",
          "description": "Marketing leader that is building a new department, or graduating to marketing automation platforms in order to automate and scale their marketing efforts."
        }
      ]
    }
  };