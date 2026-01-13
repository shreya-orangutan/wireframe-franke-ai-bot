import { configureStore } from "@reduxjs/toolkit"
import productReducer from "./slices/product-slice"
import documentReducer from "./slices/document-slice"
import sessionReducer from "./slices/session-slice"
import uiPreferencesReducer from "./slices/ui-preferences-slice"
import userReducer from "./slices/user-slice"

export const store = configureStore({
  reducer: {
    product: productReducer,
    document: documentReducer,
    session: sessionReducer,
    uiPreferences: uiPreferencesReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
