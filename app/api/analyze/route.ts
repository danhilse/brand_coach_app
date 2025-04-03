// api/analyze/route.ts
import { NextResponse } from "next/server";
import { analyzeContent } from "@/lib/analyze-content";
import { getMockAnalysisResults } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const { content, platform, demoMode } = await request.json();

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Use mock data if in demo mode
    if (demoMode) {
      const mockResults = getMockAnalysisResults(content, platform || "website");
      // Add a delay to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json(mockResults);
    }

    // Call the Claude API through the analyzeContent function
    const analysisResults = await analyzeContent(content, platform || "website");
    return NextResponse.json(analysisResults);
  } catch (error) {
    console.error("Error analyzing content:", error);
    return NextResponse.json({ error: "Failed to analyze content" }, { status: 500 });
  }
}