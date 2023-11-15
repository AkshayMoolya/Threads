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

const page = async ({ params }: { params: { username: string } }) => {
  const userInfo = await fetchUser(params.username);

  const userPost = await fetchRepliedPosts(userInfo?.id);
  const user = await currentUser();

  // console.log("check this", userPost, "this is end");

  // console.log(userPost[0].children);

  // interface Child {
  //   _id: string; // Change the type to match the actual ID type (e.g., ObjectId)
  //   id: string;
  //   content: {
  //     text: string;
  //     images: string[]; // Change the type to match the actual image URL type
  //   };
  //   author: {
  //     _id: string; // Change the type to match the actual ID type
  //     id: string;
  //     image: string; // Change the type to match the actual image URL type
  //     isAdmin: boolean;
  //     name: string;
  //   };
  //   parentId: string; // Change the type to match the actual ID type
  //   children: Child[]; // Recursively use the Child type for nested children
  //   likes: string[]; // Change the type to match the actual ID type
  //   createdAt: Date; // Change the type to match the actual date type
  //   __v: number;
  // }

  return (
    <>
      <div className="w-full mt-4 flex px-2 sm:px-0">
        <Link
          href={`/profile/${params.username}`}
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
        userPost.map((post) => (
          <>
            {post.parent && post.parent.parent ? (
              <Link href={"/thread/" + post.parent.parentId}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex pl-2 text-neutral-600"
                >
                  <ArrowUp className="w-4 h-4 mr-2" />
                  <div className="overflow-hidden rounded-full h-4 w-4 mr-2 bg-neutral-600">
                    <Image
                      src={post.parent.parent.author.image}
                      alt={post.parent.parent.author.name + "'s avatar"}
                      width={16}
                      height={16}
                    />
                  </div>
                  See earlier reply
                </Button>
              </Link>
            ) : null}
            {post.parent ? (
              <Newcard
                key={post.parent.id}
                parent={true}
                post={post.parent}
                currentUserId={user?.id}
                isCurrentUserAdmin={userInfo?.isAdmin}
                isComment={false}
              />
            ) : null}
            <Newcard
              post={post}
              key={post.id}
              parent
              currentUserId={user?.id}
              isCurrentUserAdmin={userInfo?.isAdmin}
              isComment={true}
            />
          </>
        ))
      )}
    </>
  );
};

export default page;
