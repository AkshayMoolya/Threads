import Newcard from "@/components/cards/newcard";
import { Button } from "@/components/ui/button";
import {
  fetchRepliedPosts,
  fetchUser,
  fetchUserPosts,
} from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { ArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const userInfo = await fetchUser(params.id);
  const userPost: any = await fetchRepliedPosts(userInfo._id);
  const user = await currentUser();

  console.log(userPost[0].children);

  interface Child {
    _id: string; // Change the type to match the actual ID type (e.g., ObjectId)
    id: string;
    content: {
      text: string;
      images: string[]; // Change the type to match the actual image URL type
    };
    author: {
      _id: string; // Change the type to match the actual ID type
      id: string;
      image: string; // Change the type to match the actual image URL type
      isAdmin: boolean;
      name: string;
    };
    parentId: string; // Change the type to match the actual ID type
    children: Child[]; // Recursively use the Child type for nested children
    likes: string[]; // Change the type to match the actual ID type
    createdAt: Date; // Change the type to match the actual date type
    __v: number;
  }

  return (
    <>
      <div className="w-full mt-4 flex px-2 sm:px-0">
        <Link
          href={`/profile/${params.id}`}
          className="w-full h-10 py-2 font-medium border-b border-background duration-200 hover:border-gray-600 hover:text-neutral-500 text-center text-neutral-600"
        >
          Threads
        </Link>
        <button className="w-full h-10 py-2 font-semibold border-b border-b-black dark:border-b-white  text-center">
          Replies
        </button>
      </div>
      {userPost.length === 0 ? (
        <div className="text-neutral-600 mt-4 text-center leading-loose">
          No replies posted yet.
        </div>
      ) : (
        userPost.map((post: any) => (
          <>
            <Newcard
              key={post.id}
              currentUserId={user?.id}
              isCurrentUserAdmin={userInfo.isAdmin}
              parent={true}
              post={post}
              isComment={false}
            />

            {post.children
              ? post.children.map((childItems: any) =>
                  childItems.author._id.toString() ===
                  userInfo._id.toString() ? (
                    <Newcard
                      key={childItems._id}
                      currentUserId={user?.id}
                      parent
                      post={childItems}
                      isComment={true}
                      isCurrentUserAdmin={userInfo.isAdmin}
                    />
                  ) : null
                )
              : null}
          </>
        ))
      )}
    </>
  );
};

export default page;
