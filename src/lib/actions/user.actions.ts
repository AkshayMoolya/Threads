"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import Thread from "../models/thread.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";
import Like from "../models/like.model";
import Notification from "../models/notification.model";

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    const user = await User.findOne({ id: userId });

    return user;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface Params {
  userId: string | undefined;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId })
      .populate({
        path: "threads",
        model: Thread,
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name image isAdmin",
          },
          {
            path: "children",
            model: Thread,
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
      .lean();
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
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}

type followUserProps = {
  userId: string;
  followingId: string;
  pathname: string;
};



export const followUser = async ({ userId, followingId, pathname }: followUserProps) => {
  try {
    // Update the user to add the followingId to the followers array
    await User.findByIdAndUpdate(followingId, {
      $addToSet: { followers: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $addToSet: { following: followingId },
    });

    // Create a follow notification for the user being followed
    if (userId !== followingId) {
      const notification = new Notification({
        user: followingId,
        type: "FOLLOW",
        userWhoTriggered: userId,
      });
      await notification.save();
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

export const unfollowUser = async ({ userId, followingId, pathname }: unfollowUser) => {
  try {
    // Update the user to remove the followingId from the followers array
    await User.findByIdAndUpdate(userId, { $pull: { following: followingId } });
    await User.findByIdAndUpdate(followingId, { $pull: { followers: userId } });

    await Notification.findOneAndDelete({
      user: followingId,
      type: "FOLLOW",
      userWhoTriggered: userId,
    });

    // Call revalidatePath with the provided pathname
    revalidatePath(pathname);
  } catch (error) {
    // Handle any errors here
    console.error("Error unfollowing user:", error);
  }
};

type fetchFollowers = {
  userId: string;
  name: string;
};

export const fetchFollowers = async ({ userId, name }: fetchFollowers) => {
  try {
    // Find the user by their ID and populate the 'followers' field to get user details
    const user:any = await User.findById(userId)
      .populate({
        path: "followers",
        match: name
          ? { name: { $regex: new RegExp(name, "i") } } // Case-insensitive name search
          : {}, // Match all followers if no name is provided
      })
      .lean();

    if (!user) {
      throw new Error("User not found");
    }

    // Access the array of matching followers
    const matchingFollowers = user.followers.filter((follower: any) => {
      return !name || follower.name.toLowerCase().includes(name.toLowerCase());
    });

    return matchingFollowers;
  } catch (error) {
    console.error("Error searching followers by name:", error);
    throw error; // Handle the error as needed in your application
  }
};

export const fetchFollowing = async ({ userId, name }: any) => {
  try {
    // Find the user by their ID and populate the 'following' field to get user details
    const user:any = await User.findById(userId)
      .populate({
        path: "following",
        match: name
          ? { name: { $regex: new RegExp(name, "i") } } // Case-insensitive name search
          : {}, // Match all followings if no name is provided
      })
      .lean();

    if (!user) {
      throw new Error("User not found");
    }

    // Access the array of matching followings
    const matchingFollowings = user.following.filter((following: any) => {
      return !name || following.name.toLowerCase().includes(name.toLowerCase());
    });

    return matchingFollowings;
  } catch (error) {
    console.error("Error searching followings by name:", error);
    throw error; // Handle the error as needed in your application
  }
};

export async function fetchRepliedPosts(userId: string) {
  try {
    connectToDB();

    // Find all threads and populate them with children
    const threads = await Thread.find({})
      .populate({
        path: "children",
        model: Thread,
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name image isAdmin",
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
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name image isAdmin",
            },
          },
        ],
      })
      .populate({
        path: "author",
        model: User,
        select: "_id id name image isAdmin",
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
      .lean();

    // Filter the threads based on children.author === userId
    const filteredThreads = threads.filter((thread) =>
      thread.children.some(
        (child: any) => child.id.toString() === userId.toString()
      )
    );

    return filteredThreads;
  } catch (error) {
    console.error("Error fetching user threads and populating:", error);
    throw error;
  }
}
