import mongoose from "mongoose";

interface INotification extends Document {
  follower: mongoose.Types.ObjectId; // User who sent the follow request
  following: mongoose.Types.ObjectId; // User who received the follow request
  status: "pending" | "accepted" | "rejected"; // Status of the follow request
  createdAt: Date; // Timestamp of the notification
}

const notificationSchema = new mongoose.Schema<INotification>({
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
}, { timestamps: true });

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);