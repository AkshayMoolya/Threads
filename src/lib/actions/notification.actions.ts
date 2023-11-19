"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { revalidatePath } from "next/cache";
import { db } from "../db";

type fetchNotificationsProps = {
  userId: string;
};

export async function fetchNotifications({ userId }: fetchNotificationsProps) {
  try {
    // Find all notifications for the given user
    const notifications = await db.notifications.findMany({
      where: { userId: userId },
      include: {
        user: true,
        thread: true,
        userWhotriggered: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Return the notifications
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

type fetchLikeNotificationsProps = {
  userId: string;
};

export const fetchLikeNotifications = async ({
  userId,
}: fetchLikeNotificationsProps) => {
  try {
    // Find all "like" notifications for the user
    const likeNotifications = await prisma.notifications.findMany({
      where: {
        userId: userId,
        type: "LIKE",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        userWhotriggered: true,
        thread: true,
        user: true,
      },
    });

    return likeNotifications;
  } catch (error) {
    console.error("Error fetching like notifications:", error);
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
    const replyNotifications = await db.notifications.findMany({
      where: {
        userId: userId,
        type: "COMMENT",
      },
      include: {
        userWhotriggered: true,
        thread: true,
        user: true,
      },
    });

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
    const result = await db.notifications.updateMany({
      where: {
        userId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    // Return the number of notifications marked as read
    revalidatePath(path);
    return result.count;
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    throw error; // Handle the error as needed in your application
  }
};

type GetUnreadNotificationCountProps = {
  userId: string | undefined;
};

export const getUnreadNotificationCount = async ({
  userId,
}: GetUnreadNotificationCountProps) => {
  try {
    // Fetch and count unread notifications for the user
    const unreadNotificationCount = await db.notifications.findMany({
      where: {
        userId: userId,
        isRead: false,
      },
    });

    return unreadNotificationCount.length;
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    throw error; // Handle the error as needed in your application
  }
};
