import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Session } from "@/lib/schemas"

interface SessionState {
  sessions: Session[]
  currentSession: Session | null
}

const initialState: SessionState = {
  sessions: [
    {
      id: "s1",
      productId: "1",
      productName: "CloudSync Pro",
      videoWatched: true,
      guidelinesAccepted: true,
      messages: [
        {
          id: "m1",
          role: "user",
          content: "How do I configure the sync settings?",
          timestamp: new Date("2026-01-03T10:30:00").toISOString(),
        },
        {
          id: "m2",
          role: "assistant",
          content:
            "To configure sync settings, navigate to Settings > Synchronization. You can set up automatic sync intervals, choose which folders to sync, and configure conflict resolution rules.",
          timestamp: new Date("2026-01-03T10:30:15").toISOString(),
        },
      ],
      status: "completed",
      startedAt: new Date("2026-01-03T10:15:00").toISOString(),
      lastAccessedAt: new Date("2026-01-03T11:00:00").toISOString(),
      completedAt: new Date("2026-01-03T11:00:00").toISOString(),
    },
    {
      id: "s2",
      productId: "2",
      productName: "DataGuard Shield",
      videoWatched: true,
      guidelinesAccepted: true,
      messages: [],
      status: "completed",
      startedAt: new Date("2026-01-04T14:20:00").toISOString(),
      lastAccessedAt: new Date("2026-01-04T15:10:00").toISOString(),
      completedAt: new Date("2026-01-04T15:10:00").toISOString(),
    },
    {
      id: "s3",
      productId: "3",
      productName: "SecureAuth Max",
      videoWatched: false,
      guidelinesAccepted: true,
      messages: [],
      status: "in-progress",
      startedAt: new Date("2026-01-05T09:00:00").toISOString(),
      lastAccessedAt: new Date("2026-01-05T09:30:00").toISOString(),
    },
  ],
  currentSession: null,
}

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    startSession: (state, action: PayloadAction<{ productId: string; productName: string }>) => {
      const newSession: Session = {
        id: `s${Date.now()}`,
        productId: action.payload.productId,
        productName: action.payload.productName,
        videoWatched: false,
        guidelinesAccepted: false,
        messages: [],
        status: "in-progress",
        startedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
      }
      state.currentSession = newSession
    },
    acceptGuidelines: (state) => {
      if (state.currentSession) {
        state.currentSession.guidelinesAccepted = true
      }
    },
    completeVideo: (state) => {
      if (state.currentSession) {
        state.currentSession.videoWatched = true
      }
    },
    addMessage: (state, action: PayloadAction<{ role: "user" | "assistant"; content: string }>) => {
      if (state.currentSession) {
        state.currentSession.messages.push({
          id: `m${Date.now()}`,
          role: action.payload.role,
          content: action.payload.content,
          timestamp: new Date().toISOString(),
        })
      }
    },
    completeSession: (state) => {
      if (state.currentSession) {
        state.currentSession.status = "completed"
        state.currentSession.lastAccessedAt = new Date().toISOString()
        state.currentSession.completedAt = new Date().toISOString()
        state.sessions.push(state.currentSession)
        state.currentSession = null
      }
    },
    markIncomplete: (state) => {
      if (state.currentSession) {
        state.currentSession.status = "incomplete"
        state.currentSession.lastAccessedAt = new Date().toISOString()
        state.sessions.push(state.currentSession)
        state.currentSession = null
      }
    },
  },
})

export const { startSession, acceptGuidelines, completeVideo, addMessage, completeSession, markIncomplete } =
  sessionSlice.actions
export default sessionSlice.reducer
