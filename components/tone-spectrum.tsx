"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";

interface ToneSpectrumProps {
  supportivePercentage: number;
  platform: string;
  content: string;
}

// Define interfaces for the analysis functionality
interface PhrasingChange {
  original: string;
  suggested: string;
  rationale: string;
}

interface ToneAdjustmentEvaluation {
  currentStateAnalysis: {
    toneBalance: string;
  };
  specificAdjustments: {
    phrasingChanges: PhrasingChange[];
  };
}

interface AdditionalAnalysis {
  section: string;
  analysis: ToneAdjustmentEvaluation;
}

interface SpectrumSection {
  range: string;
  label: {
    top: string;
    bottom: string;
  };
  threshold: number;
  channels: string[];
  color: string;
  supportiveRange: number[];
}

// Define the spectrum data
const spectrumData = [
  {
    range: "10% CHALLENGING /s 90% SUPPORTIVE",
    label: {
      top: "10% CHALLENGING",
      bottom: "90% SUPPORTIVE",
    },
    threshold: 20,
    channels: ["VIDEO", "SOCIAL", "ADVERTISING"],
    color: "#00babe", // teal
    supportiveRange: [85, 95],
  },
  {
    range: "30% CHALLENGING / 70% SUPPORTIVE",
    label: {
      top: "30% CHALLENGING",
      bottom: "70% SUPPORTIVE",
    },
    threshold: 40,
    channels: ["BLOGS", "EMAIL MKTG"],
    color: "#20d5c8", // lighter teal
    supportiveRange: [65, 75],
  },
  {
    range: "50% CHALLENGING / 50% SUPPORTIVE",
    label: {
      top: "50% CHALLENGING",
      bottom: "50% SUPPORTIVE",
    },
    threshold: 60,
    channels: ["WEBINAR", "EBOOKS", "PR", "WEBSITE"],
    color: "#f2a2a2", // light pink
    supportiveRange: [45, 55],
  },
  {
    range: "70% CHALLENGING / 30% SUPPORTIVE",
    label: {
      top: "70% CHALLENGING",
      bottom: "30% SUPPORTIVE",
    },
    threshold: 80,
    channels: ["CUSTOMER MARKETING", "PRODUCT"],
    color: "#f47c7c", // darker pink
    supportiveRange: [25, 35],
  },
  {
    range: "90% CHALLENGING / 10% SUPPORTIVE",
    label: {
      top: "90% CHALLENGING",
      bottom: "10% SUPPORTIVE",
    },
    threshold: 100,
    channels: ["CS TEAM", "CONNECT.ACT-ON.COM"],
    color: "#ff5757", // red
    supportiveRange: [5, 15],
  },
];

// Mock function to simulate the API call for adjusting tone spectrum
const adjustToneSpectrum = async (
  content: string,
  params: { challengingPercentage: number; supportivePercentage: number }
) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return mock data based on the parameters
  return {
    currentStateAnalysis: {
      toneBalance: `Your content currently has ${params.supportivePercentage}% supportive tone and ${params.challengingPercentage}% challenging tone.`,
    },
    specificAdjustments: {
      phrasingChanges: [
        {
          original: "You should consider improving this aspect.",
          suggested:
            params.supportivePercentage > 50
              ? "We believe this aspect offers an opportunity for growth."
              : "This aspect needs immediate improvement.",
          rationale:
            params.supportivePercentage > 50
              ? "More supportive language emphasizes collaboration and opportunity."
              : "More challenging language creates urgency and directness.",
        },
        {
          original: "The data shows average performance.",
          suggested:
            params.supportivePercentage > 50
              ? "The data indicates areas where you're doing well, with room to grow."
              : "The data clearly shows where performance is falling short.",
          rationale:
            params.supportivePercentage > 50
              ? "Highlighting positives while acknowledging growth opportunities."
              : "Direct assessment creates clear expectations and urgency.",
        },
      ],
    },
  } as ToneAdjustmentEvaluation;
};

export default function ToneSpectrum({
  supportivePercentage,
  platform,
  content,
}: ToneSpectrumProps) {
  const [markerPosition, setMarkerPosition] = useState(0);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
  const [idealSegment, setIdealSegment] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] =
    useState<AdditionalAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calculate the position of the marker based on supportive percentage
  useEffect(() => {
    // Calculate position (0-100%)
    setMarkerPosition(100 - supportivePercentage);

    // Find the ideal segment for the current platform
    const platformLower = platform.toLowerCase();
    for (let i = 0; i < spectrumData.length; i++) {
      const segment = spectrumData[i];
      const channelsLower = segment.channels.map((c) =>
        c.toLowerCase().replace("-", "")
      );

      if (
        channelsLower.some(
          (channel) =>
            platformLower === channel ||
            platformLower.includes(channel) ||
            channel.includes(platformLower)
        )
      ) {
        setIdealSegment(i);
        break;
      }
    }

    // Find which segment the current supportive percentage falls into
    for (let i = 0; i < spectrumData.length; i++) {
      const segment = spectrumData[i];
      if (
        supportivePercentage >= segment.supportiveRange[0] &&
        supportivePercentage <= segment.supportiveRange[1]
      ) {
        setActiveSegment(i);
        break;
      }
    }
  }, [supportivePercentage, platform]);

  const getCurrentCategory = (score: number): SpectrumSection | undefined => {
    return spectrumData.find((data, index) => {
      const lowerBound = index === 0 ? 0 : spectrumData[index - 1].threshold;
      const upperBound = data.threshold;
      return score > lowerBound && score <= upperBound;
    });
  };

  const currentCategory = getCurrentCategory(100 - supportivePercentage);

  const handleSectionClick = async (
    section: SpectrumSection,
    index: number
  ) => {
    try {
      setLoading(section.label.top);
      setError(null);
      setCurrentAnalysis(null); // Clear current analysis while loading

      const challengingPercentage = parseInt(section.label.top.split("%")[0]);
      const supportivePercentage = parseInt(section.label.bottom.split("%")[0]);

      const result = await adjustToneSpectrum(content, {
        challengingPercentage,
        supportivePercentage,
      });

      setCurrentAnalysis({
        section: section.label.top,
        analysis: result,
      });
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze tone");
    } finally {
      setLoading(null);
    }
  };

  const PhrasingChangeCard = ({ change }: { change: PhrasingChange }) => (
    <div className="bg-slate-50 rounded p-4 mb-4 border border-slate-200">
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <span className="font-semibold text-sm min-w-[80px]">Original:</span>
          <span className="text-sm text-slate-600">{change.original}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-semibold text-sm min-w-[80px]">Suggested:</span>
          <span className="text-sm text-blue-600">{change.suggested}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-semibold text-sm min-w-[80px]">Rationale:</span>
          <span className="text-sm text-slate-600">{change.rationale}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Tone of Voice Spectrum</CardTitle>
        <CardDescription>
          Analysis of content tone balance between supportive and challenging
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Percentage labels */}
        <div className="flex justify-between text-xs text-muted-foreground">
          {spectrumData.map((segment, index) => (
            <div key={`label-${index}`} className="text-center w-1/5 px-1">
              {segment.label.top} / <br></br> {segment.label.bottom}
            </div>
          ))}
        </div>

        <div className="flex justify-between text-xs font-medium">
          <div className="text-right"></div>
        </div>

        {/* Spectrum bar */}
        <div className="relative h-10">
          <div className="absolute inset-0  flex">
            {spectrumData.map((segment, index) => (
              <div
                key={`segment-${index}`}
                className="w-1/5 h-full transition-all duration-300 flex items-center justify-center cursor-pointer"
                style={{
                  backgroundColor: segment.color,
                  opacity:
                    hoveredIndex === index
                      ? 1
                      : activeSegment === index
                      ? 1
                      : idealSegment === index
                      ? 0.8
                      : 0.6,
                }}
                onClick={() => handleSectionClick(segment, index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* {idealSegment === index && (
                  <div className="absolute top-full mt-2 text-xs font-medium text-center w-full">
                    Ideal for {platform}
                  </div>
                )} */}
              </div>
            ))}
          </div>

          {/* Marker */}
          <motion.div
            className="absolute top-0 w-1 h-14 bg-black z-10"
            style={{
              left: `calc(${markerPosition}% - 1px)`,
            }}
            initial={{ top: -20, opacity: 0 }}
            animate={{ top: -10, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold">
              {supportivePercentage}% Supportive
            </div>
            <div className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold">
              {100 - supportivePercentage}% Challenging
            </div>
          </motion.div>
        </div>

        {/* Labels */}
        <div className="flex text-xs">
          <div className="w-1/2 text-left font-medium">SUPPORTIVE</div>
          <div className="w-1/2 text-right font-medium">CHALLENGING</div>
        </div>

        {/* Channel lists */}
        <div className="flex justify-between text-xs">
          {spectrumData.map((segment, index) => (
            <div key={`channels-${index}`} className="w-1/5 px-1">
              {segment.channels.map((channel, channelIndex) => (
                <div
                  key={`channel-${index}-${channelIndex}`}
                  className={`mb-1 ${
                    platform.toLowerCase() ===
                    channel.toLowerCase().replace("-", "")
                      ? "font-bold"
                      : ""
                  }`}
                >
                  -{channel}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="mt-4 p-4 bg-slate-50 rounded border border-slate-200 text-center">
            <div className="animate-pulse">
              Analyzing tone for {loading} balance...
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded border border-red-200 text-red-600">
            Error: {error}
          </div>
        )}

        {/* Analysis Results */}
        {currentAnalysis && (
          <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
            <div className="space-y-6">
              {/* Current State Analysis */}
              <div>
                <h4 className="text-base font-semibold mb-2">
                  Current Tone Balance
                </h4>
                <p className="text-sm text-slate-600">
                  {currentAnalysis.analysis.currentStateAnalysis.toneBalance}
                </p>
              </div>

              {/* Recommended Changes */}
              <div>
                <h4 className="text-base font-semibold mb-4">
                  Recommended Changes for {currentAnalysis.section} Balance
                </h4>
                <div className="space-y-4">
                  {currentAnalysis.analysis.specificAdjustments.phrasingChanges.map(
                    (change, index) => (
                      <PhrasingChangeCard key={index} change={change} />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
