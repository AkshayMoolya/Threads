"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Thread from "../models/thread.model";
import Like from "../models/like.model";
import mongoose from "mongoose";
import { string } from "zod";

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
          select: "name image id",
        })
        .populate({
          path: "children",
          populate: {
            path: "author",
            model: User,
            select: "_id name parentId image",
          },
        })
        .populate({
          path: "likes",
          model: Like,
          populate: {
            path: "user",
            model: User,
            select: "_id name image",
          },
        }),

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
}

export async function createThread({ content, author, path }: Params) {
  try {
    connectToDB();

    const createdThread = await Thread.create({
      content,
      author,
      // Assign communityId if provided, or leave it null for personal account
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
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

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
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Thread,
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

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
      content,
      author: userId,
      parentId: threadId, // Set the parentId to the original thread's ID
    });

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save();

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

export const likeThread = async ({ thread, userId, pathname }: any) => {
  try {
    // Create a new Like document
    const like = await Like.create({
      thread: thread,
      user: userId,
    });

    // Update the Thread document to connect the like
    await Thread.updateOne({ _id: thread }, { $push: { likes: like._id } });

    // if (userId !== receiverId) {
    //   // Create a new Notification document
    //   await Notification.create({
    //     senderId: userId,
    //     threadId: thread,
    //     type: "LIKE",
    //     receiverId: receiverId,
    //   });
    // }

    // Assuming you have functions like revalidatePath implemented elsewhere
    revalidatePath(pathname);
    // revalidatePath("/notifications");
``
    console.log("Thread liked successfully.");
  } catch (error) {
    console.error("Error liking thread:", error);
  }
};
