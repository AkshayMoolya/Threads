import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread", // Assuming you have a Thread model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Like = mongoose.models.Like || mongoose.model("Like", likeSchema);

export default Like;
