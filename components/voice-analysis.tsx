import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Check, AlertTriangle } from "lucide-react"
import ToneSpectrum from "./tone-spectrum"

interface VoicePersonalityEvaluation {
  analysis: string
  score: number
  toneBalance: {
    supportive: number
    challenging: number
  }
  strengths: string[]
  improvements: string[]
  voiceAttributes: {
    [key: string]: {
      score: number
      feedback: string
    }
  }
}

export default function VoiceAnalysis({ data }: { data: VoicePersonalityEvaluation }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Strong"
    if (score >= 60) return "Moderate"
    return "Needs Work"
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Voice & Tone Analysis</CardTitle>
            <CardDescription>Evaluation of content against Act-On&apos;s brand voice guidelines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Overall Voice Score</span>
                <span className="text-sm font-medium">{data.score}%</span>
              </div>
              <Progress value={data.score} className={getScoreColor(data.score)} />
              <p className="mt-4 text-sm">{data.analysis}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tone Balance</CardTitle>
            <CardDescription>Supportive vs. Challenging balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Supportive</span>
                  <span className="text-sm">{data.toneBalance.supportive}%</span>
                </div>
                <Progress value={data.toneBalance.supportive} className="bg-blue-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Challenging</span>
                  <span className="text-sm">{data.toneBalance.challenging}%</span>
                </div>
                <Progress value={data.toneBalance.challenging} className="bg-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add the Tone Spectrum visualization */}
      <ToneSpectrum
        supportivePercentage={data.toneBalance.supportive}
        platform="website" // This should be passed from the parent component
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Check className="h-5 w-5 text-green-500" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.strengths.map((strength, index) => (
                <li key={index} className="text-sm flex gap-2">
                  <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.improvements.map((improvement, index) => (
                <li key={index} className="text-sm flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Voice Attributes</CardTitle>
          <CardDescription>Detailed analysis of specific voice attributes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.voiceAttributes).map(([attribute, { score, feedback }]) => (
              <div key={attribute} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{attribute}</h4>
                  <Badge variant={score >= 70 ? "default" : "outline"}>{getScoreLabel(score)}</Badge>
                </div>
                <Progress value={score} className={`mb-2 ${getScoreColor(score)}`} />
                <p className="text-sm text-muted-foreground">{feedback}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

