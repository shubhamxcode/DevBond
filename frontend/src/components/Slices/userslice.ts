import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  userId: string | null;
  username: string | null;
  selectedField: string 
}

const initialState: UserState = {
  userId: null,
  username: null,
  selectedField: ""
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
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;