"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Session } from "@/lib/schemas"
import { Bot, User, Send, Mic, MicOff } from "lucide-react"

interface SessionHistoryModalProps {
  session: Session
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SessionHistoryModal({ session, open, onOpenChange }: SessionHistoryModalProps) {
  const [messages, setMessages] = useState(session.chatHistory || [])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = {
      role: "user" as const,
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        role: "assistant" as const,
        content: "Thank you for your question. I'm here to help you continue your training session.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceInput = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Simulate recording
      setTimeout(() => {
        setInput("This is a transcribed voice message")
        setIsRecording(false)
      }, 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{session.productName} - Training Session</DialogTitle>
            <Badge variant={session.status === "completed" ? "default" : "secondary"}>{session.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date(session.startedAt).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Video Player */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base">Training Video</h3>
            <Card>
              <CardContent className="p-0">
                <video controls className="w-full rounded-lg aspect-video bg-black">
                  <source
                    src="https://samplefile.com/static/samples/video/mp4/mp4_15s_sample_file_868KB.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </CardContent>
            </Card>
          </div>

          {/* Chat History with Continue Chat */}
          <div className="space-y-3 flex flex-col">
            <h3 className="font-semibold text-base">Chat Conversation</h3>
            <Card className="flex-1 flex flex-col">
              <CardContent className="p-0 flex-1 flex flex-col min-h-0">
                <ScrollArea className="flex-1 p-4">
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.role === "assistant" && (
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`rounded-lg px-4 py-2 max-w-[75%] ${
                              message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          {message.role === "user" && (
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="bg-secondary">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                      <div ref={scrollRef} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-muted-foreground text-center">No chat history available</p>
                    </div>
                  )}
                </ScrollArea>

                <div className="border-t p-4 space-y-3">
                  <div className="flex gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Continue the conversation..."
                      className="min-h-[60px] resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Button
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                      onClick={handleVoiceInput}
                      className="gap-2"
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      {isRecording ? "Stop Recording" : "Voice Input"}
                    </Button>
                    <Button onClick={handleSend} disabled={!input.trim()} size="sm" className="gap-2">
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
