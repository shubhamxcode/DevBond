import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  userId: string | null;
  username: string | null;
  selectedField: string;
  accessToken: null;
  followedUsers: string[]; // New state to manage followed users
}

const initialState: UserState = {
  userId: null,
  username: null,
  selectedField: '',
  accessToken: null,
  followedUsers: [], // Initialize as an empty array
};

const userSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
    setselectedfield: (state, action) => {
      state.selectedField = action.payload;
    },
    setusername: (state, action) => {
      state.username = action.payload;
    },
    setaccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    followUser: (state, action) => {
      state.followedUsers.push(action.payload); // Add user ID to followed users
    },
    unfollowUser: (state, action) => {
      state.followedUsers = state.followedUsers.filter(id => id !== action.payload); // Remove user ID from followed users
    },
  },
});

export const { setUserId, setselectedfield, setusername, setaccessToken, followUser, unfollowUser } = userSlice.actions;
export default userSlice.reducer;
