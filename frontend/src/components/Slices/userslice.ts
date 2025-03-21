import { createSlice } from '@reduxjs/toolkit';
import { FollowedUser } from '../../types'; // Import the FollowedUser type

interface UserState {
  userId: string | null;
  username: string | null;
  selectedField: string;
  accessToken: string | null;
  followedUsers: FollowedUser[]; // Update this line
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
      const { userId, username, selectedField } = action.payload;
      if (!state.followedUsers.includes(userId)) {
        state.followedUsers.push({ userId, username, selectedField });
      }
    },
    unfollowUser: (state, action) => {
      const { userId } = action.payload;
      state.followedUsers = state.followedUsers.filter(user => user.userId !== userId);
    },
  },
});

export const { setUserId, setselectedfield, setusername, setaccessToken, followUser, unfollowUser } = userSlice.actions;
export default userSlice.reducer;
