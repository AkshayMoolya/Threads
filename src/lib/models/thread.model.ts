import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  content: {
    type: mongoose.Schema.Types.Mixed,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Like",
    },
  ],
});

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;
