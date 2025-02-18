import { createSlice } from '@reduxjs/toolkit';
// import { User } from '../../types';

interface UserState {
  userId: string | null;
  username: string | null;
  selectedField: string;
  accessToken:null
}

const initialState: UserState = {
  userId: null,
  username: null,
  selectedField: '',
  accessToken:null
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
    setaccessToken:(state,action)=>{
      state.accessToken=action.payload
    }
  },
});

export const { setUserId, setselectedfield, setusername,setaccessToken } = userSlice.actions;
export default userSlice.reducer;