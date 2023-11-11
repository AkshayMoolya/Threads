"use server";

import { revalidatePath } from "next/cache";

import { db } from "../db";
import { threads } from "@prisma/client";
import { tr } from "date-fns/locale";

export async function fetchPosts(
  pageNumber = 1,
  pageSize = 20
): Promise<{ posts: threads[]; isNext: boolean }> {
  // Get the skip amount
  const skipAmount = (pageNumber - 1) * pageSize;

  // Get the total number of posts
  const totalPostsCount = await db.threads.count({
    where: { parent: null },
  });

  // Get the paginated list of posts
  const posts = await db.threads.findMany({
    where: { parent: null },
    include: {
      likes: true,
      author: true,
      parent: true,
      children: {
        include: {
          author: true,
          likes: true,
          children: true,
        },
      },
    },
    skip: skipAmount,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });

  // Check if there are more posts to fetch
  const isNext = totalPostsCount > skipAmount + posts.length;

  // Return the posts and the `isNext` flag
  return { posts, isNext };
}

export async function getUserThread(userid: string) {
  const result = await db.users.findFirst({
    where: { id_: userid },
    include: {
      threads: {
        include: {
          author: true,
        },
      },
    },
  });

  return result;
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
    await db.threads.create({
      data: {
        content,
        authorId: author,
        id_: id,
      },
    });

    // Revalidate path
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  } finally {
    db.$disconnect();
  }
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    // Get all of the thread's child threads.
    const childrenThreads = await db.threads.findMany({
      where: { parentId: id },
    });

    // Get all the related notifications
    const notifications = await db.notifications.findMany({
      where: { threadId: id },
    });

    // Delete all the notifications
    for (const notification of notifications) {
      await db.notifications.delete({ where: { id: notification.id } });
    }

    // Recursively delete all of the child threads.
    for (const childThread of childrenThreads) {
      await deleteThread(childThread.id, path);
    }

    // Delete the thread's likes.
    await db.likes.deleteMany({ where: { threadId: id } });

    // Delete the thread itself.
    await db.threads.delete({ where: { id: id } });

    // Revalidate the path.
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}

export async function fetchThreadById(threadId: string) {
  try {
    const thread = await db.threads.findFirst({
      where: { id: threadId },
      include: {
        author: true,
        likes: true,
        parent: {
          include: {
            author: true,
          },
        },
        children: {
          include: {
            parent: {
              include: {
                author: true,
              },
            },
            author: true,
            likes: true,
            children: {
              include: {
                author: true,
                likes: true,
              },
            },
          },
        },
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
  try {
    // Find the original thread by its ID
    const originalThread = await db.threads.findFirst({
      where: { id: threadId },
    });

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    // Create the new comment thread
    const commentThread = await db.threads.create({
      data: {
        id_: userId,
        content,
        authorId: userId,
        parentId: threadId,
      },
    });

    // Create a notification for the original thread's author
    if (originalThread.authorId !== userId) {
      await db.notifications.create({
        data: {
          userId: originalThread.authorId,
          type: "COMMENT",
          threadId: commentThread.id,
          userWhotriggeredId: userId,
        },
      });
    }

    // Add the comment thread's ID to the original thread's children array
    // await db.threads.update({
    //   where: { id: threadId },
    //   data: {
    //     children: {
    //       create: commentThread,
    //     },
    //   },
    // });

    // Revalidate the path
    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}

type likeThreadProps = {
  thread: string;
  userId: string;
  id: string;
  pathname: string;
};

export const likeThread = async ({
  thread,
  userId,
  id,
  pathname,
}: likeThreadProps) => {
  try {
    // Create a new Like document
    await db.likes.create({
      data: {
        id_: id,
        user: userId,
        threadId: thread,
      },
    });

    // Get the thread author
    const threadDoc = await db.threads.findUnique({
      where: { id: thread },
    });
    const threadAuthorId = threadDoc?.authorId;

    // Create a notification for the thread owner
    if (userId !== threadAuthorId) {
      await db.notifications.create({
        data: {
          userId: threadAuthorId, // The thread author's user ID
          type: "LIKE",
          threadId: thread,
          userWhotriggeredId: userId,
        }, // The user who triggered the like
      });
    }

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
  id: string;
};

export async function unlikeThread({
  thread,
  userId,
  id,
  pathname,
}: unlikeThreadProps) {
  try {
    // Find the Like document for the given user and thread and delete it
    const like = await db.likes.delete({
      where: { threadId: thread, user: userId },
    });

    if (!like) {
      throw new Error("Like not found"); // Handle the case where the like doesn't exist
    }

    const threadDoc = await db.threads.findUnique({
      where: { id: thread },
    });

    // Delete the Notification document for the like
    await db.notifications.delete({
      where: {
        userId: threadDoc?.authorId,
        threadId: thread,
        userWhotriggeredId: userId,
        type: "LIKE",
      },
    });

    // Revalidate the pathname and notifications path
    revalidatePath(pathname);

    console.log("Thread unliked successfully.");
  } catch (error) {
    console.error("Error unliking thread:", error);
  }
}
