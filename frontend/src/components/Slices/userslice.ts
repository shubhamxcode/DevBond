import { createSlice } from '@reduxjs/toolkit';
import { User } from '../../types';

interface UserState {
  userId: string | null;
  username: string | null;
  selectedField: string;
  suggestions: User[];
}

const initialState: UserState = {
  userId: null,
  username: null,
  selectedField: '',
  suggestions: [],
};

const userSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setUser(state, action) {
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.selectedField = action.payload.selectedField;
    },
    setSuggestions(state, action) {
      state.suggestions = action.payload;
    },
  },
});

export const { setUser, setSuggestions } = userSlice.actions;
export default userSlice.reducer;