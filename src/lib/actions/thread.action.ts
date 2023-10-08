"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Thread from "../models/thread.model";
import Like from "../models/like.model";
import mongoose from "mongoose";
import Notification from "../models/notification.model";

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  try {
    const skipAmount = (pageNumber - 1) * pageSize;

    // Query for posts and count documents in parallel
    const [posts, totalPostsCount] = await Promise.all([
      Thread.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: "desc" })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({
          path: "author",
          model: User,
          select: "name image id isAdmin",
          match: { id: { $exists: true } },
        })
        .populate({
          path: "children",
          populate: {
            path: "author",
            model: User,
            select: "_id name parentId image isAdmin",
            match: { id: { $exists: true } },
          },
        })
        .populate({
          path: "likes",
          model: Like,
          match: { _id: { $exists: true } },
          populate: {
            path: "user",
            model: User,
            select: "id name image isAdmin",
            match: { _id: { $exists: true } },
          },
        })
        .lean(),
      Thread.countDocuments({ parentId: { $in: [null, undefined] } }),
    ]);

    const isNext = totalPostsCount > skipAmount + posts.length;
    console.log("im called");
    return { posts, isNext };
  } catch (error) {
    // Handle the error gracefully, e.g., log it
    console.error("Error in fetchPosts:", error);
    throw error; // Rethrow the error for higher-level error handling
  }
}

interface Params {
  content: {
    text: string;
    images: string;
  };
  author: string;
  path: string;
  id: string;
}

export async function createThread({ content, author, path, id }: Params) {
  try {
    connectToDB();

    const createdThread = await Thread.create({
      content,
      author,
      id,
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id);

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    if (mainThread.parent) {
      await Thread.updateOne(
        { _id: mainThread.parentId },
        { $pull: { children: id } }
      );
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()),
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Remove likes from the main thread
    await Thread.updateOne(
      { _id: id },
      { $pull: { likes: mainThread.likes } } // Assuming `likes` is an array of like IDs
    );

    // Delete the likes from the Like model
    await Like.deleteMany({ _id: { $in: mainThread.likes } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // Update Community model
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}

export async function fetchThreadById(threadId: string) {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image isAdmin",
      })
      .populate({
        path: "children",
        model: Thread,
        options: {
          sort: { createdAt: "desc" }, // Sort children by createdAt in descending order
        },
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image isAdmin", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Thread,
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image isAdmin", // Select only _id and username fields of the author
            },
          },
          {
            path: "likes",
            model: Like,
            match: { _id: { $exists: true } },
            populate: {
              path: "user",
              model: User,
              select: "id name image isAdmin",
              match: { _id: { $exists: true } },
            },
          },
        ],
      })
      .populate({
        path: "likes",
        model: Like,
        match: { _id: { $exists: true } },
        populate: {
          path: "user",
          model: User,
          select: "id name image",
          match: { _id: { $exists: true } },
        },
      });

    return thread;
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}

interface commentTypes {
  threadId: string;
  content: {
    text: string;
    images: string[];
  };
  userId: string;
  path: string;
}

export async function addCommentToThread({
  threadId,
  content,
  userId,
  path,
}: commentTypes) {
  connectToDB();

  try {
    // Find the original thread by its ID
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    // Create the new comment thread
    const commentThread = new Thread({
      id: userId,
      content,
      author: userId,
      parentId: threadId, // Set the parentId to the original thread's ID
    });

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save();

    // Create a notification for the original thread's author
    if (originalThread.author.toString() !== userId) {
      const notification = new Notification({
        user: originalThread.author,
        type: "COMMENT",
        thread: threadId,
        userWhoTriggered: userId,
      });
      await notification.save();
    }

    // Add the comment thread's ID to the original thread's children array
    originalThread.children.push(savedCommentThread._id);

    // Save the updated original thread to the database
    await originalThread.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}

type likeThreadProps = {
  userId: string;
  thread: string;
  pathname: string;
  id:string;
};


export const likeThread = async ({ thread, userId, id, pathname }: likeThreadProps) => {
  try {
    // Create a new Like document
    const like = await Like.create({
      id,
      thread: thread,
      user: userId,
    });

    // Get the thread author
    const threadDoc = await Thread.findById(thread);
    const threadAuthorId = threadDoc.author;

    // Create a notification for the thread owner
    if (userId !== threadAuthorId) {
      await Notification.create({
        user: threadAuthorId, // The thread author's user ID
        type: "LIKE",
        thread: thread,
        userWhoTriggered: userId, // The user who triggered the like
      });
    }

    // await User.findByIdAndUpdate(
    //   threadAuthorId,
    //   {
    //     $push: { notifications: notification._id },
    //   },
    //   { new: true }
    // );

    // Update the thread to include the like
    await Thread.updateOne({ _id: thread }, { $push: { likes: like._id } });

    // Assuming you have functions like revalidatePath implemented elsewhere
    revalidatePath(pathname);
    // revalidatePath("/notifications");
    console.log("Thread liked successfully.");
  } catch (error) {
    console.error("Error liking thread:", error);
  }
};


type unlikeThreadProps = {
  userId: string;
  thread: string;
  pathname: string;
  id:string;
};

export const unlikeThread = async ({ thread, userId, id, pathname }: unlikeThreadProps) => {
  try {
    // Find the Like document for the given user and thread and delete it
    const like = await Like.findOneAndDelete({ thread, user: userId });

    if (!like) {
      throw new Error("Like not found"); // Handle the case where the like doesn't exist
    }

    // Update the Thread document to remove the like reference
    await Thread.updateOne({ _id: thread }, { $pull: { likes: like._id } });

    await Notification.findOneAndDelete({
      thread,
      userWhoTriggered: userId,
      type: "LIKE",
    });

    // Assuming you have functions like revalidatePath implemented elsewhere
    revalidatePath(pathname);
    // revalidatePath("/notifications");
    console.log("Thread unliked successfully.");
  } catch (error) {
    console.error("Error unliking thread:", error);
  }
};
