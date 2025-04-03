"use client";

import type React from "react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, Info, Edit, ArrowRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import VoiceAnalysis from "@/components/voice-analysis";
import AudienceAnalysis from "@/components/audience-analysis";
import MessagingAnalysis from "@/components/messaging-analysis";
import OverallAnalysis from "@/components/overall-analysis";
import { ModelSelector } from "@/components/ui/ModelSelector";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getMockAnalysisResults } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import { AIProvider } from "@/lib/providers";

export default function Home() {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("website");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] =
    useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overall");
  const [hasSearched, setHasSearched] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"input" | "rewrites">(
    "input"
  );
  const [aiProvider, setAiProvider] = useState<AIProvider>("anthropic");
  const contentRef = useRef<HTMLDivElement>(null);
  const rewritesRef = useRef<HTMLDivElement>(null);
  const demoToggleRef = useRef<HTMLDivElement>(null);

  // Simulate initial loading
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(loadingTimer);
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handlePlatformChange = (value: string) => {
    setPlatform(value);
  };

  const handleAiProviderChange = (value: AIProvider) => {
    setAiProvider(value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setContent(event.target.result.toString());
      }
    };
    reader.readAsText(file);
  };

  // Update only the analyzeContent function for better error handling
  const analyzeContent = async () => {
    if (!content.trim()) return;

    setIsAnalyzing(true);
    setHasSearched(true);
    // Clear any previous recommendations
    setRecommendations([]);

    try {
      if (demoMode) {
        // Use mock data in demo mode
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay
        const mockResults = getMockAnalysisResults(content, platform);
        // Destructure to remove contentRecommendations
        const { contentRecommendations, ...analysisOnly } = mockResults;
        setAnalysisResults(analysisOnly);
      } else {
        // Call the real API
        try {
          const response = await fetch("/api/analyze", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content,
              platform,
              demoMode,
              provider: aiProvider,
            }),
          });

          if (!response.ok) {
            // Get the error details from the response if possible
            const errorData = await response.json().catch(() => null);
            const errorMessage =
              errorData?.error ||
              `API request failed with status ${response.status}`;
            throw new Error(errorMessage);
          }

          const data = await response.json();
          setAnalysisResults(data);
        } catch (apiError) {
          console.error("API Error:", apiError);
          throw apiError; // Re-throw to be caught by the outer catch
        }
      }

      setActiveTab("overall"); // Reset to first tab when new analysis is complete
    } catch (error) {
      console.error("Error analyzing content:", error);
      alert(
        `Error: ${
          error instanceof Error ? error.message : "Failed to analyze content"
        }`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // New function to generate content recommendations
  const generateRecommendations = async () => {
    if (!analysisResults) return;

    setIsGeneratingRecommendations(true);

    try {
      if (demoMode) {
        // Use mock recommendations in demo mode
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

        // Import function dynamically to avoid circular imports
        const { getMockRecommendations } = await import(
          "../lib/mock-recommendations"
        );
        const mockRecommendations = getMockRecommendations(content, platform);
        setRecommendations(mockRecommendations);
      } else {
        // Call the recommendations API
        const response = await fetch("/api/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            platform,
            analysis: analysisResults,
            provider: aiProvider,
          }),
        });

        if (!response.ok) {
          throw new Error("Generating recommendations failed");
        }

        const data = await response.json();
        setRecommendations(data);
      }

      // Switch to the rewrites section once recommendations are generated
      setActiveSection("rewrites");
    } catch (error) {
      console.error("Error generating recommendations:", error);
      alert(
        `Error: ${
          error instanceof Error
            ? error.message
            : "Failed to generate recommendations"
        }`
      );
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  const toggleSection = (section: "input" | "rewrites") => {
    setActiveSection(section);
  };

  const applyRewrite = (improved: string) => {
    setContent(improved);
    setActiveSection("input");
  };

  // Function to skip the loading animation
  const handleSkip = () => {
    setLoading(false);
  };

  if (loading) {
    return (
      <div
        className="flex h-screen items-center justify-center bg-[var(--app-background)]"
        onClick={handleSkip}
      >
        <div className="flex flex-col items-center gap-4 cursor-pointer">
          <Image
            src="loading_logo 2.svg"
            alt="Act-On Loading"
            width={200}
            height={200}
            priority
            className="animate-pulse"
          />
          <h1 className="text-2xl font-semibold animate-pulse text-[var(--text)]">
            Brand Voice Analysis Tool
          </h1>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "voice":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "audience":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "messaging":
        return "bg-teal-100 text-teal-800 border-teal-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--app-background)]">
      {/* New container for AI Model Selector in the top left */}
      <div className="absolute left-4 top-4 z-50">
        <div className="flex items-center space-x-2 rounded p-2 bg-white/50 backdrop-blur-sm border border-gray-200">
          <Label htmlFor="ai-model" className="text-sm text-muted-foreground">
            AI Model
          </Label>
          <ModelSelector
            value={aiProvider}
            onChange={handleAiProviderChange}
            disabled={isAnalyzing || demoMode}
          />
        </div>
      </div>

      {/* Container for Demo mode toggle remains on the top right */}
      <div className="absolute right-4 top-4 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                ref={demoToggleRef}
                className="flex items-center space-x-2 rounded p-2 bg-white/50 backdrop-blur-sm border border-gray-200"
              >
                <Switch
                  id="demo-mode"
                  checked={demoMode}
                  onCheckedChange={(checked) => {
                    setDemoMode(checked);
                    if (!checked) {
                      // If turning off demo mode, set default provider
                      setAiProvider("anthropic");
                    }
                  }}
                />
                <Label
                  htmlFor="demo-mode"
                  className="flex items-center text-sm text-muted-foreground"
                >
                  Demo Mode
                  <Info className="ml-1 h-3 w-3" />
                </Label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Generate analysis examples instantly without calling the AI API.
                Disabling demo mode will use the selected AI model.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="container-acton py-8 transition-opacity duration-500">
        <div className="mb-8 flex flex-col items-center gap-6">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-QeR7XHkv78gXqGGllmqPRBmwwBJUl5.svg"
            alt="Act-On Logo"
            width={150}
            height={55}
            priority
          />
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[var(--text)]">
              Brand Voice Analysis Tool
            </h1>
            <p className="mt-1 text-[var(--text-light)]">
              Analyze marketing content against Act-On&apos;s brand guidelines
            </p>
          </div>
        </div>

        {/* Main layout container - transitions from centered to side-by-side */}
        <div
          className={`mx-auto flex ${
            hasSearched
              ? "lg:mx-0 lg:flex-row lg:items-start"
              : "flex-col items-center"
          } gap-6 transition-all duration-500 ease-in-out`}
        >
          {/* Query Card - becomes sticky when results are shown but maintains width */}
          <div
            className={`${
              hasSearched
                ? "sticky top-0 pt-6 lg:w-[480px] lg:max-w-[35%]"
                : "max-w-[570px]"
            } z-10 w-full min-w-[280px] bg-gradient-to-b from-[var(--app-background)] from-70% via-[var(--app-background)] to-transparent pb-12 backdrop-blur-[410%] transition-all duration-500 ease-in-out`}
          >
            <Card className="border-none bg-transparent shadow-none transition-all duration-500 ease-in-out">
              <CardHeader className="pb-2">
                <CardDescription className="text-[var(--text-light)]">
                  Enter content to analyze and view improvement suggestions
                </CardDescription>
              </CardHeader>

              {/* Section toggle buttons */}
              {analysisResults && (
                <div className="flex border-b border-[var(--border-color)]">
                  <button
                    onClick={() => toggleSection("input")}
                    className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                      activeSection === "input"
                        ? "border-[var(--primary-base)] text-[var(--primary-base)]"
                        : "border-transparent text-[var(--text-light)] hover:text-[var(--text)]"
                    }`}
                  >
                    Input
                  </button>
                  <button
                    onClick={() =>
                      recommendations.length > 0
                        ? toggleSection("rewrites")
                        : generateRecommendations()
                    }
                    className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                      activeSection === "rewrites"
                        ? "border-[var(--primary-base)] text-[var(--primary-base)]"
                        : "border-transparent text-[var(--text-light)] hover:text-[var(--text)]"
                    }`}
                  >
                    {recommendations.length > 0
                      ? "Suggested Rewrites"
                      : "Generate Rewrites"}
                    {isGeneratingRecommendations && (
                      <Loader2 className="ml-2 h-3 w-3 inline animate-spin" />
                    )}
                  </button>
                </div>
              )}

              <AnimatePresence mode="wait">
                {activeSection === "input" ? (
                  <motion.div
                    key="input-section"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    ref={contentRef}
                  >
                    <CardContent className="space-y-4 pt-4">
                      <Textarea
                        placeholder="Paste your marketing content here..."
                        className="min-h-[300px] border-[var(--border-color)]"
                        value={content}
                        onChange={handleContentChange}
                      />

                      <div className="flex items-center justify-between">
                        <div className="relative">
                          <input
                            type="file"
                            id="file-upload"
                            className="sr-only"
                            accept=".txt,.md,.doc,.docx"
                            onChange={handleFileUpload}
                          />
                          <label
                            htmlFor="file-upload"
                            className="flex items-center gap-2 text-sm cursor-pointer text-[var(--text-light)] hover:text-[var(--primary-base)]"
                          >
                            <Upload size={16} />
                            Upload file
                          </label>
                        </div>
                        <div>
                          <Select
                            value={platform}
                            onValueChange={handlePlatformChange}
                          >
                            <SelectTrigger className="border-[var(--border-color)]">
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="website">Website</SelectItem>
                              <SelectItem value="email">
                                Email Marketing
                              </SelectItem>
                              <SelectItem value="social">
                                Social Media
                              </SelectItem>
                              <SelectItem value="blog">Blog</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="webinar">Webinar</SelectItem>
                              <SelectItem value="ebook">
                                eBook/Whitepaper
                              </SelectItem>
                              <SelectItem value="product">
                                Product UI
                              </SelectItem>
                              <SelectItem value="cs">CS Team</SelectItem>
                              <SelectItem value="connect">
                                Connect.Act-On.com
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                      <Button
                        onClick={analyzeContent}
                        disabled={!content.trim() || isAnalyzing}
                        className="w-full btn-acton btn-acton-primary"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing with {demoMode ? "Demo Mode" : aiProvider}
                            ...
                          </>
                        ) : (
                          "Analyze Content"
                        )}
                      </Button>
                    </CardFooter>
                  </motion.div>
                ) : (
                  <motion.div
                    key="rewrites-section"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    ref={rewritesRef}
                    className="overflow-y-auto"
                  >
                    <CardContent className="space-y-4 pt-4 max-h-[600px] overflow-y-auto">
                      {recommendations.length > 0 ? (
                        <div className="space-y-6 animate-fadeIn">
                          {recommendations.map(
                            (recommendation: any, index: number) => (
                              <div
                                key={index}
                                className="border border-[var(--border-color)] rounded-lg p-4 bg-white"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                  <h3 className="font-medium text-base text-[var(--text)]">
                                    {recommendation.title}
                                  </h3>
                                  <div className="flex gap-2">
                                    <Badge
                                      className={getCategoryColor(
                                        recommendation.category
                                      )}
                                    >
                                      {recommendation.category}
                                    </Badge>
                                    <Badge
                                      className={getPriorityColor(
                                        recommendation.priority
                                      )}
                                    >
                                      {recommendation.priority} Priority
                                    </Badge>
                                  </div>
                                </div>

                                <p className="text-sm mb-4 text-[var(--text)]">
                                  {recommendation.description}
                                </p>

                                <div className="space-y-4">
                                  {recommendation.examples.map(
                                    (example: any, exIndex: number) => (
                                      <div
                                        key={exIndex}
                                        className="bg-[var(--table-hover-1)] rounded-md p-3"
                                      >
                                        <div className="flex items-center gap-1 text-xs font-medium text-[var(--text-light)] mb-2">
                                          <Edit className="h-3 w-3" />
                                          <span>
                                            Example Rewrite {exIndex + 1}
                                          </span>
                                        </div>

                                        <div className="space-y-4">
                                          <div className="bg-white rounded p-3 border border-dashed border-[var(--border-color)]">
                                            <div className="text-xs font-medium mb-1 text-[var(--text-light)]">
                                              Original
                                            </div>
                                            <p className="text-sm text-[var(--text)]">
                                              {example.original}
                                            </p>
                                          </div>

                                          <div className="relative bg-white rounded p-3 border-2 border-[var(--primary-base)]/20">
                                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 text-[var(--primary-base)]">
                                              <ArrowRight className="h-4 w-4" />
                                            </div>
                                            <div className="flex justify-between items-center mb-1">
                                              <div className="text-xs font-medium text-[var(--primary-base)]">
                                                Improved
                                              </div>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-xs text-[var(--primary-base)] hover:text-[var(--primary-hover)] hover:bg-[var(--table-hover-1)]"
                                                onClick={() =>
                                                  applyRewrite(example.improved)
                                                }
                                              >
                                                Apply
                                              </Button>
                                            </div>
                                            <p className="text-sm text-[var(--text)]">
                                              {example.improved}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="mt-2 text-xs text-[var(--text-light)]">
                                          <span className="font-medium">
                                            Why this works better:{" "}
                                          </span>
                                          {example.explanation}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : isGeneratingRecommendations ? (
                        <div className="flex items-center justify-center py-16">
                          <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[var(--primary-base)]" />
                            <p className="text-[var(--text)]">
                              Generating content recommendations...
                            </p>
                            <p className="text-sm text-[var(--text-light)] mt-2">
                              {demoMode
                                ? "Using demo mode"
                                : `Using ${aiProvider} model`}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-16 px-4">
                          <p className="text-[var(--text)] mb-4">
                            No rewrite suggestions available yet.
                          </p>
                          <Button
                            onClick={generateRecommendations}
                            className="btn-acton btn-acton-primary"
                          >
                            Generate Content Recommendations
                          </Button>
                          <p className="text-xs text-[var(--text-light)] mt-4">
                            This will use AI to analyze your content and suggest
                            improvements based on Act-On's brand guidelines.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          {/* Results container with smooth size transitions */}
          <div
            className={`${
              hasSearched
                ? "min-h-0 flex-1 opacity-100 transition-all duration-700 ease-in-out"
                : "h-0 w-0 overflow-hidden opacity-0"
            } transition-all duration-700 ease-in-out`}
          >
            {isAnalyzing ? (
              <Card className="h-full flex items-center justify-center border-none bg-transparent shadow-none">
                <CardContent className="py-12 text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-[var(--primary-base)]" />
                  <p className="text-[var(--text)]">
                    Analyzing your content against Act-On&apos;s brand
                    guidelines...
                  </p>
                  <p className="text-sm text-[var(--text-light)] mt-2">
                    {demoMode ? "Using demo mode" : `Using ${aiProvider} model`}
                  </p>
                </CardContent>
              </Card>
            ) : analysisResults ? (
              <Card className="h-full border-none bg-transparent shadow-none">
                <CardHeader>
                  <CardTitle className="text-[var(--text)]">
                    Analysis Results
                  </CardTitle>
                  <CardDescription className="text-[var(--text-light)]">
                    Evaluation of your content against Act-On&apos;s brand
                    guidelines
                    {demoMode ? " (Demo Mode)" : ` (${aiProvider})`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4 mb-4 bg-[var(--table-hover-1)]">
                      <TabsTrigger
                        value="overall"
                        className="data-[state=active]:bg-white data-[state=active]:text-[var(--primary-base)]"
                      >
                        Overall
                      </TabsTrigger>
                      <TabsTrigger
                        value="voice"
                        className="data-[state=active]:bg-white data-[state=active]:text-[var(--primary-base)]"
                      >
                        Voice & Tone
                      </TabsTrigger>
                      <TabsTrigger
                        value="audience"
                        className="data-[state=active]:bg-white data-[state=active]:text-[var(--primary-base)]"
                      >
                        Audience
                      </TabsTrigger>
                      <TabsTrigger
                        value="messaging"
                        className="data-[state=active]:bg-white data-[state=active]:text-[var(--primary-base)]"
                      >
                        Messaging
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="voice" className="animate-fadeIn">
                      <VoiceAnalysis
                        data={{
                          ...analysisResults.voicePersonality,
                          platform: platform,
                        }}
                      />
                    </TabsContent>

                    <TabsContent value="audience" className="animate-fadeIn">
                      <AudienceAnalysis data={analysisResults.targetAudience} />
                    </TabsContent>

                    <TabsContent value="messaging" className="animate-fadeIn">
                      <MessagingAnalysis
                        data={analysisResults.messagingValues}
                      />
                    </TabsContent>

                    <TabsContent value="overall" className="animate-fadeIn">
                      <OverallAnalysis
                        data={{
                          ...analysisResults.overall,
                        }}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="border-t border-[var(--border-color)] pt-4 text-sm text-[var(--text-light)] flex justify-between items-center">
                  <div>
                    {demoMode
                      ? "Demo mode - using mock data"
                      : `Analysis powered by ${aiProvider}`}
                  </div>
                  {analysisResults &&
                    !isGeneratingRecommendations &&
                    recommendations.length === 0 && (
                      <Button
                        onClick={generateRecommendations}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        Generate Recommendations
                      </Button>
                    )}
                </CardFooter>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
