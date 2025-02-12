import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userId: string | null;
  username: string | null;
}

const initialState: UserState = {
  userId: null,
  username: null,
};

const userSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ userId: string; username: string }>) {
      state.userId = action.payload.userId;
      state.username = action.payload.username;
    },
  },
});

export const { setUser} = userSlice.actions;
export default userSlice.reducer;