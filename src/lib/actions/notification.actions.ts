"use server";

import { revalidatePath } from "next/cache";
import Notification from "../models/notification.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

type fetchNotificationsProps = {
  userId: string;
};

export const fetchNotifications = async ({
  userId,
}: fetchNotificationsProps) => {
  try {
    // Find all notifications for the given user
    const notifications = await Notification.find({ user: userId })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "user",
        model: User,
        select: "id",
      })
      .populate({
        path: "userWhoTriggered",
        model: User,
        select: "id name username image isAdmin",
      })
      .populate({
        path: "thread",
        model: Thread,
      })
      .lean();

    // You can perform additional processing if needed

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

type fetchLikeNotificationsProps = {
  userId: string;
};

export const fetchLikeNotifications = async ({
  userId,
}: fetchLikeNotificationsProps) => {
  try {
    // Find all "like" notifications for the user
    const likeNotifications = await Notification.find({
      user: userId,
      type: "LIKE",
    })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "userWhoTriggered",
        model: User,
        select: "id name username image isAdmin",
      })
      .populate({
        path: "thread",
        model: Thread,
      });

    return likeNotifications;
  } catch (error) {
    console.error("Error fetching like notifications:", error);
    throw error; // Handle the error as needed in your application
  }
};

type fetchFollowNotificationsProps = {
  userId: string;
};

export const fetchFollowNotifications = async ({
  userId,
}: fetchFollowNotificationsProps) => {
  try {
    // Find all "follow" notifications for the user
    const followNotifications = await Notification.find({
      user: userId,
      type: "FOLLOW",
    })
      .populate("userWhoTriggered") // Optionally, populate the user who triggered the follow
      .exec();

    return followNotifications;
  } catch (error) {
    console.error("Error fetching follow notifications:", error);
    throw error; // Handle the error as needed in your application
  }
};

type fetchReplyNotificationsProps = {
  userId: string;
};

export const fetchReplyNotifications = async ({
  userId,
}: fetchReplyNotificationsProps) => {
  try {
    // Find all "reply" notifications for the user
    const replyNotifications = await Notification.find({
      user: userId,
      type: "COMMENT", // Assuming "REPLY" is the type for reply notifications
    })
      .populate("userWhoTriggered") // Optionally, populate the user who triggered the reply action
      .populate("thread") // Optionally, populate the related thread
      .exec();

    return replyNotifications;
  } catch (error) {
    console.error("Error fetching reply notifications:", error);
    throw error; // Handle the error as needed in your application
  }
};

type markAllUnreadNotificationsAsReadProps = {
  userId: string;
  path: string;
};

export const markAllUnreadNotificationsAsRead = async ({
  userId,
  path,
}: markAllUnreadNotificationsAsReadProps) => {
  try {
    // Fetch all unread notifications for the user and mark them as read
    const result = await Notification.updateMany(
      { _id: userId, isRead: false },
      { $set: { isRead: true } }
    );

    // Return the number of notifications marked as read
    revalidatePath(path);
    return result;
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    throw error; // Handle the error as needed in your application
  }
};

type getUnreadNotificationCountProps = {
  userId: string;
};

export const getUnreadNotificationCount = async ({
  userId,
}: getUnreadNotificationCountProps) => {
  try {
    // Fetch unread notifications for the user
    const unreadNotifications = await Notification.find({
      user: userId,
      isRead: false,
    });

    // Return the count of unread notifications
    return unreadNotifications;
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    throw error; // Handle the error as needed in your application
  }
};
