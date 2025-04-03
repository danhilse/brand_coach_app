import { NextRequest, NextResponse } from "next/server";
import { generateContentRecommendations } from "@/lib/analyze-content";
import { AIProvider, isProviderConfigured } from "@/lib/providers";

export async function POST(request: NextRequest) {
  try {
    const { content, platform, analysis, provider = "anthropic" } = await request.json();

    if (!content || !platform || !analysis) {
      return NextResponse.json(
        { error: "Content, platform, and analysis data are required" },
        { status: 400 }
      );
    }

    // Check if the selected provider is configured
    if (!isProviderConfigured(provider as AIProvider)) {
      return NextResponse.json(
        { error: `The ${provider} API key is not configured` },
        { status: 400 }
      );
    }

    // Generate recommendations based on the analysis
    const recommendations = await generateContentRecommendations(
      content,
      platform,
      analysis,
      provider as AIProvider
    );

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error in recommendations API route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}