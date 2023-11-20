"use server";
import { PrismaClient, users } from "@prisma/client";

const prisma = new PrismaClient();

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import { db } from "../db";
import { redirect } from "next/navigation";

export async function fetchUser(userId: string): Promise<users | null> {
  try {
    return await db.users.findUnique({
      where: {
        id_: userId,
      },
      include: {
        threads: true,
        followers: true,
        followings: true,
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserByName(username: string): Promise<users | null> {
  try {
    return await db.users.findUnique({
      where: {
        username: username,
      },
      include: {
        threads: true,
        followers: true,
        followings: true,
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function createUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    const user = await db.users.findUnique({ where: { id_: userId } });
    if (!user) {
      await db.users.create({
        data: {
          id_: userId,
          username: username,
          name: name,
          bio: bio,
          image: image,
          onboarded: true,
          createdAt: new Date(),
        },
      });
    }
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

interface updateUserProps {
  userId: string;
  bio: string;
  name: string;
  username: string;
  image: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  username,
  image,
}: updateUserProps) {
  try {
    await db.users.update({
      where: {
        id_: userId,
      },
      data: {
        username: username,
        name: name,
        bio: bio,
        image: image,
      },
    });

    revalidatePath(`/`);
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    // Find all threads authored by the user with the given userId
    const threads = await db.threads.findMany({
      where: {
        authorId: userId,
        parent: null,
      },
      include: {
        author: true,
        parent: {
          include: {
            author: true,
          },
        },
        children: {
          include: {
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
        likes: true,
      },
    });

    return threads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<{ users: users[]; isNext: boolean }> {
  try {
    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;
    // Define the sort options for the fetched users based on createdAt field and provided sort order.

    // Fetch all users based on the provided query and sort options.
    const users = await db.users.findMany({
      where: {
        id_: { not: userId }, // Exclude the current user from the results.
        OR: [
          { username: { contains: searchString, mode: "insensitive" } },
          { name: { contains: searchString, mode: "insensitive" } },
        ],
      },
      include: {
        followers: true,
        followings: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skipAmount,
      take: pageSize,
    });

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = users.length;

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

type followUserProps = {
  userId: string;
  followingId: string;
  pathname: string;
};

export const followUser = async ({
  userId,
  followingId,
  pathname,
}: followUserProps) => {
  try {
    // Update the user to add the followingId to the followers array
    await db.users.update({
      where: { id: followingId },
      data: {
        followers: {
          connect: { id: userId },
        },
      },
    });

    // Add userId to the followingIds array of the following user
    await db.users.update({
      where: { id: userId },
      data: {
        followings: {
          connect: { id: followingId },
        },
      },
    });

    // Create a follow notification for the user being followed
    if (userId !== followingId) {
      await db.notifications.create({
        data: {
          userId: followingId,
          type: "FOLLOW",
          userWhotriggeredId: userId,
        },
      });
    }

    // Call revalidatePath with the provided pathname
    revalidatePath(pathname);
  } catch (error) {
    // Handle any errors here
    console.error("Error following user:", error);
  }
};

type unfollowUser = {
  userId: string;
  followingId: string;
  pathname: string;
};

export const unfollowUser = async ({
  userId,
  followingId,
  pathname,
}: unfollowUser) => {
  try {
    // Update the user to remove the followingId from the followers array
    await db.users.update({
      where: { id: userId },
      data: {
        followings: {
          disconnect: [{ id: followingId }],
        },
      },
    });

    // Remove userId from the followingIds array of the following user
    await db.users.update({
      where: { id: followingId },
      data: {
        followers: {
          disconnect: [{ id: userId }],
        },
      },
    });

    // Delete the follow notification for the user being unfollowed
    await db.notifications.delete({
      where: {
        id: followingId,
        userId: followingId,
        type: "FOLLOW",
        userWhotriggeredId: userId,
      },
    });

    // Call revalidatePath with the provided pathname
    revalidatePath(pathname);
  } catch (error) {
    // Handle any errors here
    console.error("Error unfollowing user:", error);
  }
};

interface fetchFollowingsProps {
  userId: string;
  searchString?: string;
}

export async function fetchFollowings({
  userId,
  searchString,
}: fetchFollowingsProps) {
  try {
    // Find the user by their ID and populate the 'following' field to get user details
    const user = await db.users.findUnique({
      where: { id_: userId },
      include: { followings: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Access the array of followings
    const followings = user.followings;

    // Filter the followings by search string if provided
    if (searchString) {
      const matchingFollowings = followings.filter((following) => {
        return (
          following.name.toLowerCase().includes(searchString.toLowerCase()) ||
          following.username.toLowerCase().includes(searchString.toLowerCase())
        );
      });

      return matchingFollowings;
    }

    // Return all followings if no search string is provided
    return followings;
  } catch (error) {
    console.error("Error searching followings by search string:", error);
    throw error; // Handle the error as needed in your application
  }
}

interface fetchFollowersProps {
  userId: string;
  searchString?: string;
}

export async function fetchFollowers({
  userId,
  searchString,
}: fetchFollowersProps) {
  try {
    // Find the user by their ID and populate the 'followers' field to get user details
    const user = await db.users.findUnique({
      where: { id_: userId },
      include: { followers: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Access the array of followers
    const followers = user.followers;

    // Filter the followers by search string if provided
    if (searchString) {
      const matchingFollowers = followers.filter((follower) => {
        return (
          follower.name.toLowerCase().includes(searchString.toLowerCase()) ||
          follower.username.toLowerCase().includes(searchString.toLowerCase())
        );
      });

      return matchingFollowers;
    }

    // Return all followers if no search string is provided
    return followers;
  } catch (error) {
    console.error("Error searching followers by search string:", error);
    throw error; // Handle the error as needed in your application
  }
}

export async function fetchRepliedPosts(userId: string | undefined) {
  try {
    const posts = await db.threads.findMany({
      // where parent is not null
      where: {
        authorId: userId,
        parentId: {
          not: userId || null,
        },
      },
      include: {
        author: true,
        children: {
          include: {
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
        parent: {
          include: {
            author: true,
            children: {
              include: {
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
            parent: {
              include: {
                author: true,
              },
            },
            likes: true,
          },
        },
        likes: true,
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching user threads and populating:", error);
    throw error;
  }
}
