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

interface ICPQuadrantProps {
  userScore: number; // 0-100, 0 = pure user, 100 = pure buyer
  maturityScore: number; // 0-100, 0 = pure graduator, 100 = pure disenfranchised
  primaryPersona: string;
}

interface Persona {
  name: string;
  description: string;
  position: [number, number]; // x, y in percentage
  color: string;
  borderColor: string;
}

const personas: Persona[] = [
  {
    name: 'THE "DISENFRANCHISED" USER',
    description:
      "Experienced marketing automation user that's frustrated with their existing software platform. Looking for solutions that make their jobs easier.",
    position: [25, 75], // left, top
    color: "#e6f7ff",
    borderColor: "#0070f3",
  },
  {
    name: 'THE "DISENFRANCHISED" BUYER',
    description:
      "Marketing leader that is replacing an existing marketing automation platform. They have to lower costs due to budgetary pressure, and they have to prove marketing's ROI; migration is a point of friction.",
    position: [75, 75], // right, top
    color: "#f0fdf4",
    borderColor: "#10b981",
  },
  {
    name: 'THE "GRADUATOR" USER',
    description:
      "A user that is new to marketing automation. They don't know what's possible since they haven't done it before, but they know what they want to do. Need software to achieve that desire, and education on how to use that software.",
    position: [25, 25], // left, bottom
    color: "#f0f9ff",
    borderColor: "#38bdf8",
  },
  {
    name: 'THE "GRADUATOR" BUYER',
    description:
      "Marketing leader that is building a new department, or graduating to marketing automation platforms in order to automate and scale their marketing efforts.",
    position: [75, 25], // right, bottom
    color: "#fff1f2",
    borderColor: "#f43f5e",
  },
];

export default function ICPQuadrant({
  userScore,
  maturityScore,
  primaryPersona,
}: ICPQuadrantProps) {
  const [activePersona, setActivePersona] = useState<string | null>(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    50, 50,
  ]);

  useEffect(() => {
    // Calculate marker position based on scores
    setMarkerPosition([userScore, maturityScore]);

    // Determine which quadrant the marker is in
    let closestPersona = personas[0].name;
    let closestDistance = 100;

    personas.forEach((persona) => {
      const distance = Math.sqrt(
        Math.pow(persona.position[0] - userScore, 2) +
          Math.pow(persona.position[1] - maturityScore, 2)
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestPersona = persona.name;
      }
    });

    setActivePersona(closestPersona);
  }, [userScore, maturityScore, primaryPersona]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">ICP Quadrant Analysis</CardTitle>
        <CardDescription>
          Mapping content against Act-On&apos;s Ideal Customer Profiles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[500px] border rounded-md p-4 bg-white">
          {/* Quadrant background colors */}
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[#f0f9ff]/30"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#f0fdf4]/30"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#e6f7ff]/30"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#fff1f2]/30"></div>

          {/* Axes */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300"></div>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>

          {/* Axis labels */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white px-2 font-medium text-sm border border-gray-200 rounded shadow-sm">
            DISENFRANCHISED
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white px-2 font-medium text-sm border border-gray-200 rounded shadow-sm">
            GRADUATOR
          </div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-white px-2 font-medium text-sm rotate-270 border border-gray-200 rounded shadow-sm">
            USER
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white px-2 font-medium text-sm rotate-90 border border-gray-200 rounded shadow-sm">
            BUYER
          </div>

          {/* Persona cards */}
          {personas.map((persona, index) => {
            const isActive = activePersona === persona.name;
            const isPrimary = primaryPersona === persona.name;

            return (
              <motion.div
                key={`persona-${index}`}
                className="absolute w-[45%] rounded-lg p-4 shadow-sm transition-all duration-300"
                style={{
                  left: `${persona.position[0] - 22.5}%`,
                  top: `${persona.position[1] - 22.5}%`,
                  backgroundColor: persona.color,
                  borderWidth: isPrimary || isActive ? 2 : 1,
                  borderColor: persona.borderColor,
                  opacity: isActive || isPrimary ? 1 : 0.7,
                  zIndex: isActive || isPrimary ? 10 : 5,
                }}
                animate={{
                  scale: isActive || isPrimary ? 1.05 : 1,
                  opacity: isActive || isPrimary ? 1 : 0.7,
                }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-bold text-sm mb-2">{persona.name}</h3>
                <p className="text-xs">{persona.description}</p>

                {isPrimary && (
                  <div className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full shadow-md">
                    Primary
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Marker */}
          <div
            className="absolute z-10"
            style={{
              left: `${markerPosition[0]}%`,
              top: `${markerPosition[1]}%`,
            }}
          >
            {/* Subtle guide lines */}
            <div className="absolute left-0 top-0 w-px h-[500px] bg-primary/10 -translate-y-[250px]"></div>
            <div className="absolute left-0 top-0 w-[500px] h-px bg-primary/10 -translate-x-[250px]"></div>

            {/* Score labels - now positioned better */}
            <div className="absolute top-6 left-0 -translate-x-1/2 bg-white text-xs px-2 py-1 rounded border border-primary/20 shadow-sm whitespace-nowrap">
              {userScore}% Buyer
            </div>
            <div className="absolute left-6 top-0 -translate-y-1/2 bg-white text-xs px-2 py-1 rounded border border-primary/20 shadow-sm whitespace-nowrap">
              {maturityScore}% Disenfranchised
            </div>

            {/* Improved marker design */}
            <motion.div
              className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 z-30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
            >
              {/* Outer pulse effect */}
              <motion.div
                className="absolute w-8 h-8 rounded-full bg-primary/30 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 0.3, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />

              {/* Main marker */}
              <div className="absolute w-6 h-6 rounded-full bg-primary left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-md">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </motion.div>
          </div>

          {/* Score display */}
          <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
            <div className="text-xs font-medium">Content Position:</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                <span className="text-xs">{userScore}% Buyer</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-xs">
                  {maturityScore}% Disenfranchised
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
