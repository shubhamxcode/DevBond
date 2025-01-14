import mongoose, { mongo } from "mongoose";

const USerschema=new mongoose.Schema({
    firebaseId:{
        type:String,
        require:true,
        unique:true,

    },
    email:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    displayname:{
        name:String,
        require:true,
    },
    photourl:{
        type:String,
    }
},{timestamps:true})

export const User=mongoose.model("User",USerschema);
