import mongoose from "mongoose";

interface Follower extends Document {
    follower: mongoose.Types.ObjectId;
    username: string;
    selectedField: string;
}

const followerSchema = new mongoose.Schema<Follower>({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    username: {
        type: String,
        required: true
    },
    selectedField: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Follow = mongoose.model<Follower>("Follow", followerSchema);


