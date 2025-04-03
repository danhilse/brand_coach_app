import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Check, AlertTriangle, Lightbulb } from "lucide-react"

interface BrandEvaluation {
  analysis: string
  score: number
  summary: string
  strengths: string[]
  improvements: string[]
  recommendations: {
    priority: string
    action: string
    explanation: string
  }[]
}

export default function OverallAnalysis({ data }: { data: BrandEvaluation }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Overall Brand Alignment</CardTitle>
          <CardDescription>Comprehensive evaluation of content against Act-On&apos;s brand guidelines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Overall Brand Score</span>
              <span className="text-sm font-medium">{data.score}%</span>
            </div>
            <Progress value={data.score} className={getScoreColor(data.score)} />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Summary</h3>
              <p className="text-sm">{data.summary}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Analysis</h3>
              <p className="text-sm">{data.analysis}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Check className="h-5 w-5 text-green-500" />
              Brand Alignment Strengths
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
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-primary" />
            Actionable Recommendations
          </CardTitle>
          <CardDescription>Specific suggestions to improve brand alignment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recommendations.map((recommendation, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{recommendation.action}</h4>
                  <Badge className={getPriorityColor(recommendation.priority)}>
                    {recommendation.priority} Priority
                  </Badge>
                </div>
                <p className="text-sm">{recommendation.explanation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

