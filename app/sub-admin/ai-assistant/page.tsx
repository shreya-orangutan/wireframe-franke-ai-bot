"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { acceptGuidelines, completeVideo, completeSession, markIncomplete } from "@/lib/redux/slices/session-slice"
import { VideoPlayer } from "@/components/video-player"
import { ChatbotPanel } from "@/components/chatbot-panel"
import { SessionHistoryModal } from "@/components/session-history-modal"
import { StartSessionModal } from "@/components/start-session-modal"
import { AlertCircle, CheckCircle2, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Session } from "@/lib/schemas"

export default function SubAdminAIAssistantPage() {
  const sessions = useAppSelector((state) => state.session.sessions)
  const currentSession = useAppSelector((state) => state.session.currentSession)
  const dispatch = useAppDispatch()

  const [showGuidelines, setShowGuidelines] = useState(false)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [sessionModalOpen, setSessionModalOpen] = useState(false)
  const [startModalOpen, setStartModalOpen] = useState(false)

  const handleSessionStarted = () => {
    setShowGuidelines(true)
  }

  const handleAcceptGuidelines = () => {
    dispatch(acceptGuidelines())
    setShowGuidelines(false)
  }

  const handleVideoComplete = () => {
    dispatch(completeVideo())
  }

  const handleComplete = () => {
    dispatch(completeSession())
  }

  const handleBack = () => {
    if (confirm("Are you sure you want to leave? This session will be marked as incomplete.")) {
      dispatch(markIncomplete())
    }
  }

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session)
    setSessionModalOpen(true)
  }

  const filteredSessions = sessions.filter((s) => s.status === "in-progress" || s.status === "completed")

  if (!currentSession) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <PageHeader
            title="AI Assistant"
            description="Start a training session with AI guidance"
            breadcrumbs={[{ label: "Sub Admin", href: "/sub-admin" }, { label: "AI Assistant" }]}
            actions={
              <Button onClick={() => setStartModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Start New Session
              </Button>
            }
          />

          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSessions.length > 0 ? (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Date Started</TableHead>
                        <TableHead>Last Accessed</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSessions.map((session) => (
                        <TableRow
                          key={session.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSessionClick(session)}
                        >
                          <TableCell className="font-medium">{session.productName}</TableCell>
                          <TableCell>
                            {new Date(session.startedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell>
                            {new Date(session.lastAccessedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={session.status === "completed" ? "default" : "secondary"}
                              className="capitalize"
                            >
                              {session.status === "in-progress" ? "In Progress" : "Completed"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No training sessions yet. Click &quot;Start New Session&quot; to begin.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <StartSessionModal
          open={startModalOpen}
          onOpenChange={setStartModalOpen}
          onSessionStarted={handleSessionStarted}
        />

        {selectedSession && (
          <SessionHistoryModal session={selectedSession} open={sessionModalOpen} onOpenChange={setSessionModalOpen} />
        )}
      </AppLayout>
    )
  }

  if (showGuidelines && !currentSession?.guidelinesAccepted) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <PageHeader
            title="Training Guidelines"
            description="Please read and accept before continuing"
            breadcrumbs={[
              { label: "Sub Admin", href: "/sub-admin" },
              { label: "AI Assistant", href: "/sub-admin/ai-assistant" },
              { label: "Guidelines" },
            ]}
          />

          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Important Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Mandatory Viewing Requirements</AlertTitle>
                <AlertDescription>
                  All guidelines must be followed to ensure proper training completion.
                </AlertDescription>
              </Alert>

              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Complete Video Viewing</p>
                    <p className="text-muted-foreground">
                      The training video must be watched in its entirety without skipping.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">No Playback Controls</p>
                    <p className="text-muted-foreground">
                      Pause, seek, and rewind functions are disabled to ensure full engagement.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Chat After Video</p>
                    <p className="text-muted-foreground">
                      The AI assistant chatbot will unlock after video completion.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Activity Recording</p>
                    <p className="text-muted-foreground">
                      All training activities are recorded for compliance and quality assurance.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Session Completion</p>
                    <p className="text-muted-foreground">
                      Leaving the session before completion will mark it as incomplete.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleBack} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleAcceptGuidelines}>I Accept - Continue to Training</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout hideSidebar={!currentSession?.videoWatched && !!currentSession}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Training Session"
            description={currentSession?.productName}
            breadcrumbs={[
              { label: "Sub Admin", href: "/sub-admin" },
              { label: "AI Assistant", href: "/sub-admin/ai-assistant" },
              { label: "Session" },
            ]}
          />
          <Badge variant={currentSession?.videoWatched ? "default" : "secondary"}>
            {currentSession?.videoWatched ? "Video Complete" : "Watching Video"}
          </Badge>
        </div>

        {!currentSession?.videoWatched ? (
          <div className="w-full max-w-5xl mx-auto">
            <VideoPlayer onVideoComplete={handleVideoComplete} />
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Video Complete!</AlertTitle>
              <AlertDescription>
                You can now chat with the AI assistant about the training material. The video is available for
                reference.
              </AlertDescription>
            </Alert>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="lg:sticky lg:top-6 h-fit">
                <VideoPlayer onVideoComplete={handleVideoComplete} showInSidebar />
              </div>

              <div>
                <ChatbotPanel />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
              <Button onClick={handleComplete}>Complete Session</Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
