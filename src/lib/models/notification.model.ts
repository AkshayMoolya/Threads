import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["LIKE", "FOLLOW", "COMMENT"],
    required: true,
  },
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
  },
  userWhoTriggered: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false, // New notifications are initially unread
  },
});

const Notification =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export default Notification;
