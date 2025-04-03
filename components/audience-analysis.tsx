import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Check, AlertTriangle, Users } from "lucide-react"
import ICPQuadrant from "./icp-quadrant"

interface TargetAudienceEvaluation {
  analysis: string
  score: number
  primaryAudience: {
    type: string
    alignment: number
    feedback: string
  }
  audienceInsights: {
    strengths: string[]
    improvements: string[]
  }
  personaMatches: {
    [key: string]: {
      score: number
      feedback: string
    }
  }
  icpAnalysis?: {
    userBuyerScore: number
    maturityScore: number
    primaryPersona: string
  }
}

export default function AudienceAnalysis({ data }: { data: TargetAudienceEvaluation }) {
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
            <CardTitle className="text-lg">Audience Targeting Analysis</CardTitle>
            <CardDescription>Evaluation of content against Act-On&apos;s target audience profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Overall Audience Alignment</span>
                <span className="text-sm font-medium">{data.score}%</span>
              </div>
              <Progress value={data.score} className={getScoreColor(data.score)} />
              <p className="mt-4 text-sm">{data.analysis}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Primary Audience</CardTitle>
            <CardDescription>Best matching audience type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">{data.primaryAudience.type}</span>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Alignment</span>
                  <span className="text-sm">{data.primaryAudience.alignment}%</span>
                </div>
                <Progress value={data.primaryAudience.alignment} className="bg-primary" />
              </div>
              <p className="text-sm mt-2">{data.primaryAudience.feedback}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add the ICP Quadrant visualization */}
      {data.icpAnalysis && (
        <ICPQuadrant
          userScore={data.icpAnalysis.userBuyerScore}
          maturityScore={data.icpAnalysis.maturityScore}
          primaryPersona={data.icpAnalysis.primaryPersona}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Check className="h-5 w-5 text-green-500" />
              Audience Targeting Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.audienceInsights.strengths.map((strength, index) => (
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
              Audience Targeting Improvements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.audienceInsights.improvements.map((improvement, index) => (
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
          <CardTitle className="text-lg">Persona Alignment</CardTitle>
          <CardDescription>How well the content aligns with Act-On&apos;s target personas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.personaMatches).map(([persona, { score, feedback }]) => (
              <div key={persona} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{persona}</h4>
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

