import mongoose from "mongoose";

interface follower extends Document{
    follower:mongoose.Schema.Types.ObjectId;
    following:mongoose.Schema.Types.ObjectId
}
const followerschema=new mongoose.Schema<follower>({
    follower:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    following:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

export const Follow=mongoose.model<follower>("Follow",followerschema)


