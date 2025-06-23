import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "../components/Slices/userslice";
import { loadState, saveState } from "../utils/persistState";

// Load persisted state from localStorage
const persistedState = loadState('userState');

// Create the store with the persisted state if available
export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
  },
  preloadedState: persistedState ? { userProfile: persistedState } : undefined,
});

// Subscribe to store changes to save state to localStorage
store.subscribe(() => {
  const state = store.getState();
  saveState('userState', state.userProfile);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
