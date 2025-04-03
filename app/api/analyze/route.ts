import { NextRequest, NextResponse } from "next/server";
import { analyzeContent } from "@/lib/analyze-content";
import { getMockAnalysisResults } from "@/lib/mock-data";
import { AIProvider, isProviderConfigured } from "@/lib/providers";

export async function POST(request: NextRequest) {
  try {
    const { content, platform, demoMode, provider = "anthropic" } = await request.json();

    if (!content || !platform) {
      return NextResponse.json(
        { error: "Content and platform are required" },
        { status: 400 }
      );
    }

    // If in demo mode, return mock results
    if (demoMode) {
      // Use mock data but without content recommendations
      const mockResults = getMockAnalysisResults(content, platform);
      // Destructure to remove contentRecommendations
      const { contentRecommendations, ...analysisOnly } = mockResults;
      return NextResponse.json(analysisOnly);
    }

    // Check if the selected provider is configured
    if (!isProviderConfigured(provider as AIProvider)) {
      const errorMessage = `The ${provider} API key is not configured in environment variables`;
      console.error(errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    // Log which provider we're using
    console.log(`Using ${provider} provider for analysis`);
    
    try {
      // Use the Vercel AI SDK with the selected provider
      // This will only return the analysis, not the recommendations
      const analysisResults = await analyzeContent(
        content, 
        platform, 
        provider as AIProvider
      );

      return NextResponse.json(analysisResults);
    } catch (aiError) {
      // Detailed error logging for AI service errors
      console.error(`AI Service Error (${provider}):`, aiError);
      return NextResponse.json(
        { error: `Error from ${provider} API: ${aiError instanceof Error ? aiError.message : "Unknown error"}` },
        { status: 500 }
      );
    }
  } catch (error) {
    // General error handler
    console.error("Unexpected error in API route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}