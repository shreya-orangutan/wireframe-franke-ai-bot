"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Mic, MicOff, Bot, User } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { addMessage } from "@/lib/redux/slices/session-slice"

export function ChatbotPanel() {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const dispatch = useAppDispatch()
  const currentSession = useAppSelector((state) => state.session.currentSession)

  const sampleQueries = [
    "What is the warrant of this product?",
    "Create a quiz for this product.",
    "Need Troubleshooting steps for error code 203...",
  ]

  const handleSend = () => {
    if (!message.trim()) return

    dispatch(addMessage({ role: "user", content: message }))

    setTimeout(() => {
      const responses = [
        "I understand your question. Let me help you with that based on the training materials.",
        "That's a great question! According to the product documentation, here's what you need to know...",
        "I can assist you with that. The key points to remember are...",
        "Based on the training video and documentation, the recommended approach is...",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      dispatch(addMessage({ role: "assistant", content: randomResponse }))
    }, 1000)

    setMessage("")
  }

  const handleSampleQuery = (query: string) => {
    setMessage(query)
  }

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder

        const audioChunks: Blob[] = []
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data)
        }

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
          // Simulate transcription
          const transcription = "This is a simulated transcription of your audio message."
          setMessage(transcription)
          stream.getTracks().forEach((track) => track.stop())
        }

        mediaRecorder.start()
        setIsRecording(true)
      } catch (error) {
        console.error("Error accessing microphone:", error)
      }
    } else {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
        setIsRecording(false)
      }
    }
  }

  return (
    <Card className="flex h-[600px] flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-lg">AI Training Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {currentSession?.messages && currentSession.messages.length > 0 ? (
              currentSession.messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[75%] ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {msg.role === "user" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-secondary">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col gap-3 h-full justify-center items-center text-center py-8">
                <Bot className="h-12 w-12 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground font-medium">No messages yet</p>
                <p className="text-xs text-muted-foreground mb-4">Try a sample query below or ask your own question</p>
                <div className="space-y-2 w-full">
                  {sampleQueries.map((query, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="w-full text-left justify-start text-xs h-auto py-2 px-3 bg-transparent"
                      onClick={() => handleSampleQuery(query)}
                    >
                      <span className="font-medium text-primary mr-2">{idx + 1}.</span>
                      {query}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t bg-background p-4">
          {isRecording && (
            <div className="mb-3 flex items-center gap-2 text-sm text-destructive">
              <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              <span className="font-medium">Recording in progress...</span>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isRecording && handleSend()}
              placeholder="Type your question or use voice input..."
              disabled={isRecording}
              className="flex-1"
            />
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={toggleRecording}
              title={isRecording ? "Stop recording" : "Start recording"}
              className="shrink-0"
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button onClick={handleSend} disabled={isRecording || !message.trim()} className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
