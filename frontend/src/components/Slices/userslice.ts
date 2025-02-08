import { createSlice } from "@reduxjs/toolkit";

interface Userprofilestate{
    username:string
}
const initialState: Userprofilestate = {
    username: "",
  };

const userProfileSlice=createSlice({
    name:"userProfile",
    initialState,
    reducers:{
        setUsername:(state,action)=>{
            state.username=action.payload
        }
    }
})

export const {setUsername}=userProfileSlice.actions
export default userProfileSlice.reducer