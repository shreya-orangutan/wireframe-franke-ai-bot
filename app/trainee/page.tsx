"use client"

import { AppLayout } from "@/components/app-layout"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppSelector } from "@/lib/redux/hooks"
import { BookOpen, Play, CheckCircle, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export default function TraineeDashboardPage() {
  const sessions = useAppSelector((state) => state.session.sessions)
  const traineeProfile = useAppSelector((state) => state.uiPreferences.userProfile)

  const completedSessions = sessions.filter((s) => s.status === "completed").length
  const inProgressSessions = sessions.filter((s) => s.status === "in-progress").length
  const totalTrainingHours = sessions.length * 2
  const totalSessions = sessions.length
  const progressPercentage = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Track your learning progress and training sessions"
          breadcrumbs={[{ label: "Trainee", href: "/trainee" }, { label: "Dashboard" }]}
        />

        <Card>
          <CardHeader>
            <CardTitle>Training Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Completion</span>
                <span className="font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {completedSessions} of {totalSessions} sessions completed
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed Sessions</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold">{completedSessions}</div>
              <div className="flex items-center gap-1 text-xs text-primary">
                <TrendingUp className="h-3 w-3" />
                <span>Great progress!</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{inProgressSessions}</div>
              <p className="text-xs text-muted-foreground">Active sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Training Hours</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalTrainingHours}h</div>
              <p className="text-xs text-muted-foreground">Total time invested</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome, {traineeProfile.fullName}!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Access your assigned training materials through the AI Assistant. Complete training videos and interact
              with the AI chatbot to enhance your product knowledge. Your progress is tracked automatically.
            </p>
            <Button asChild>
              <a href="/trainee/ai-assistant">Start Training</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
