import ThreadCard from "@/components/cards/ThreadCard";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import React from "react";
import { fetchThreadById } from "@/lib/actions/thread.action";
import Comment from "@/components/forms/Comment";
import Newcard from "@/components/newcard";
import PostThread from "@/components/forms/PostThread";
import Reply from "@/components/forms/Reply";

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <div>
        <Newcard
          key={thread._id}
          id={thread._id}
          currentUserId={user.id || ""}
          parentId={thread.parentId}
          content={thread.content}
          author={thread.author}
          createdAt={thread.createdAt}
          comments={thread.children}
          isAdmin={userInfo.isAdmin}
          isComment={true}
        />
      </div>

      <div className="mt-7">
        <Reply
          threadId={params.id}
          userImage={userInfo.image}
          userName={userInfo.name}
          userId={userInfo._id}
          isReply
        />
      </div>

      <div className="mt-10">
        {thread.children.map((childItem: any) => (
          <Newcard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user.id}
            parentId={childItem.parentId}
            content={childItem.content}
            author={childItem.author}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isAdmin={userInfo.isAdmin}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
};

export default page;
