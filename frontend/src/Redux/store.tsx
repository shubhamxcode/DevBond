import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from '../components/Slices/userslice'

// Define the shape of your state
export interface RootState {
    userProfile: {
        username: string;
    };
    // Add other slices here
}

export const store=configureStore({
    reducer:{
        userProfile:userProfileReducer
    }
})

export default store