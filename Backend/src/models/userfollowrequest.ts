import mongoose from "mongoose";

interface IFollowRequest extends Document {
  from: mongoose.Types.ObjectId; // user who sent request
  to: mongoose.Types.ObjectId;   // user who receives request
  status: "pending" | "accepted" | "rejected";
  username: string;
}

const followRequestSchema = new mongoose.Schema<IFollowRequest>({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  username: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const FollowRequest = mongoose.model<IFollowRequest>("FollowRequest", followRequestSchema);
