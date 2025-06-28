// Utility functions to manage persisted state in localStorage

// Save state to localStorage
export const saveState = (key: string, state: any): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error('Could not save state to localStorage:', error);
  }
};

// Load state from localStorage
export const loadState = (key: string): any => {
  try {
    const serializedState = localStorage.getItem(key);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Could not load state from localStorage:', error);
    return undefined;
  }
};

// Clear state from localStorage
export const clearState = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Could not clear state from localStorage:', error);
  }
};

import axios from "axios";

export const fetchMessages = async (otherUserId: string, skip = 0, limit = 20) => {
  const token = localStorage.getItem("token"); // Or from Redux
  const res = await axios.get(`/api/users/messages`, {
    params: { otherUserId, skip, limit },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data; // Assuming ApiResponse wraps in .data
}; 