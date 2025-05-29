import { createSlice } from '@reduxjs/toolkit';
import { FollowedUser } from '../../types'; // Import the FollowedUser type

// Define the RequestData interface
interface RequestData {
  from: {
    username: string;
    _id:string
  };
}

// Update the UserState to use the new RequestData interface
interface UserState {
  userId: string | null;
  username: string | null;
  selectedField: string;
  accessToken: string | null;
  followedUsers: FollowedUser[]; // Assuming FollowedUser type is an array of objects
  Requestdata: RequestData | null; // Updated this line to use RequestData
}

const initialState: UserState = {
  userId: null,
  username: null,
  selectedField: '',
  accessToken: null,
  followedUsers: [], // Initialize as an empty array
  Requestdata: null, // Start with null value for Requestdata
};

const userSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
    setreqdata: (state, action) => {
      state.Requestdata = action.payload; // The payload should match the structure of RequestData
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
      const { userId } = action.payload;
      if (!state.followedUsers.some(user => user.userId === userId)) {
        state.followedUsers.push(action.payload); // Push the whole user object
      }
    },
    unfollowUser: (state, action) => {
      const { touserId } = action.payload;
      state.followedUsers = state.followedUsers.filter(user => user.userId !== touserId);
    },
  },
});

export const { setUserId, setselectedfield, setusername, setaccessToken, followUser, unfollowUser, setreqdata } = userSlice.actions;
export default userSlice.reducer;
