import mongoose from "mongoose";

const messagehistoryschema=new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    recipientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true,
    },
},{timestamps:true})

export const Message=mongoose.model("Message",messagehistoryschema)