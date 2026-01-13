import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UIPreferences } from "@/lib/schemas"

interface UIPreferencesState {
  preferences: UIPreferences
  userProfile: {
    fullName: string
    email: string
    role: string
    dateJoined: string
    assignedCountry: string
    assignedRegion: string
    lastLogin: string
  }
}

const initialState: UIPreferencesState = {
  preferences: {
    uiLanguage: "en",
    chatbotLanguage: "en",
    theme: "light",
    notifications: true,
    chatVerbosity: "detailed",
    enableCitations: true,
  },
  userProfile: {
    fullName: "Sarah Mitchell",
    email: "sarah.mitchell@company.com",
    role: "Trainer",
    dateJoined: new Date("2024-06-15").toISOString(),
    assignedCountry: "United States",
    assignedRegion: "North America",
    lastLogin: new Date("2026-01-07T09:30:00").toISOString(),
  },
}

const uiPreferencesSlice = createSlice({
  name: "uiPreferences",
  initialState,
  reducers: {
    updatePreferences: (state, action: PayloadAction<Partial<UIPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload }
    },
    updateProfile: (state, action: PayloadAction<Partial<typeof initialState.userProfile>>) => {
      state.userProfile = { ...state.userProfile, ...action.payload }
    },
  },
})

export const { updatePreferences, updateProfile } = uiPreferencesSlice.actions
export default uiPreferencesSlice.reducer
