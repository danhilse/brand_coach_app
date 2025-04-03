import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Check, AlertTriangle, MessageSquare } from "lucide-react"

interface MessagingValuesEvaluation {
  analysis: string
  score: number
  keyThemes: {
    present: string[]
    missing: string[]
  }
  messagingPillars: {
    [key: string]: {
      score: number
      feedback: string
      examples: string[]
    }
  }
  valueAlignment: {
    [key: string]: {
      score: number
      feedback: string
    }
  }
}

export default function MessagingAnalysis({ data }: { data: MessagingValuesEvaluation }) {
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
            <CardTitle className="text-lg">Messaging Framework Analysis</CardTitle>
            <CardDescription>Evaluation of content against Act-On&apos;s messaging framework</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Overall Messaging Alignment</span>
                <span className="text-sm font-medium">{data.score}%</span>
              </div>
              <Progress value={data.score} className={getScoreColor(data.score)} />
              <p className="mt-4 text-sm">{data.analysis}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Key Themes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  Present
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.keyThemes.present.map((theme, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  Missing
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.keyThemes.missing.map((theme, index) => (
                    <Badge key={index} variant="outline" className="bg-red-50">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Messaging Pillars</CardTitle>
          <CardDescription>Alignment with Act-On&apos;s core messaging pillars</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(data.messagingPillars).map(([pillar, { score, feedback, examples }]) => (
              <div key={pillar} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{pillar}</h4>
                  <Badge variant={score >= 70 ? "default" : "outline"}>{getScoreLabel(score)}</Badge>
                </div>
                <Progress value={score} className={`mb-3 ${getScoreColor(score)}`} />
                <p className="text-sm mb-3">{feedback}</p>

                {examples.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium mb-2">Examples in Content:</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {examples.map((example, index) => (
                        <li key={index} className="flex gap-2">
                          <MessageSquare className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Value Alignment</CardTitle>
          <CardDescription>How well the content aligns with Act-On&apos;s core values</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.valueAlignment).map(([value, { score, feedback }]) => (
              <div key={value} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{value}</h4>
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

