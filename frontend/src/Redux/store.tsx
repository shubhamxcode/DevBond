import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "../components/Slices/userslice";
import { loadState, saveState } from "../utils/persistState";
import axios from 'axios';
import { setUserId, setusername, setselectedfield, setResumeInfo, setConnections } from '../components/Slices/userslice';

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

export const hydrateUserProfile = () => async (dispatch: any, getState: any) => {
  try {
    const accessToken = getState().userProfile.accessToken;
    const apiUrl = import.meta.env.DEV ? "http://localhost:4001" : import.meta.env.VITE_RENDER_URL_;
    const response = await axios.get(`${apiUrl}/api/users/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });
    const { user, resume, connections } = response.data.data;
    if (user) {
      dispatch(setUserId(user._id));
      dispatch(setusername(user.username));
      dispatch(setselectedfield(user.selectedField));
    }
    if (resume) {
      dispatch(setResumeInfo(resume));
    }
    if (connections) {
      dispatch(setConnections(connections));
    }
  } catch (error) {
    console.error('Failed to hydrate user profile:', error);
  }
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
