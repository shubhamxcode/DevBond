import mongoose from "mongoose";

const followRequestSchema=new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
},{timestamps:true})

export const Follower=mongoose.model("Follower",followRequestSchema)