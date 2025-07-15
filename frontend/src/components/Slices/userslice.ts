import { createSlice } from '@reduxjs/toolkit';
import { FollowedUser } from '../../types'; // Import the FollowedUser type
import { clearState } from '../../utils/persistState'; // Import clearState utility

interface UserState {
  userId: string | null;
  username: string | null;
  selectedField: string;
  accessToken: string | null;
  followedUsers: FollowedUser[]; // Update this line
  Techfield:string[]|null
}

const initialState: UserState = {
  userId: null,
  username: null,
  selectedField: '',
  accessToken: null,
  followedUsers: [],
  Techfield:[] // Initialize as an empty array
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
      // Check if user is already in the list
      const existingUser = state.followedUsers.find(user => user.userId === userId);
      if (!existingUser) {
        state.followedUsers.push({
          userId,
          username: username || 'Unknown User',
          selectedField: selectedField || 'Unknown Field'
        });
      }
    },
    unfollowUser: (state, action) => {
      const { userId } = action.payload;
      state.followedUsers = state.followedUsers.filter(user => user.userId !== userId);
    },
    setConnections: (state, action) => {
      // Replace all connections with new data from backend
      state.followedUsers = action.payload;
    },
    logoutUser: (state) => {
      // Reset the state to initial values
      state.userId = null;
      state.username = null;
      state.selectedField = '';
      state.accessToken = null;
      state.followedUsers = [];
      // Clear persisted state in localStorage
      clearState('userState');
    },
    Techdata: (state, action) => {
      state.Techfield = action.payload;
    }
  },
});

export const { 
  setUserId, 
  Techdata,
  setselectedfield, 
  setusername, 
  setaccessToken, 
  followUser, 
  unfollowUser,
  setConnections,
  logoutUser 
} = userSlice.actions;

export default userSlice.reducer;