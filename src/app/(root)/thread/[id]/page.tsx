import ThreadCard from "@/components/cards/ThreadCard";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import React from "react";
import Comment from "@/components/forms/Comment";
import Newcard from "@/components/cards/newcard";
import PostThread from "@/components/forms/PostThread";
import Reply from "@/components/forms/Reply";
import { fetchThreadById } from "@/lib/actions/thread.action";

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
          currentUserId={user.id || ""}
          post={thread}
          parent={false}
          isComment={false}
          isCurrentUserAdmin={userInfo.isAdmin}
        />
      </div>

      <div className="mt-7">
        <Reply threadId={params.id} userInfo={userInfo} isReply />
      </div>

      <div className="mt-10">
        {thread.children.map((childItem: any) => (
          // console.log(childItem)
          <Newcard
            key={childItem._id}
            currentUserId={user.id}
            post={childItem}
            parent
            isComment={true}
            isCurrentUserAdmin={userInfo.isAdmin}
          />
        ))}
      </div>
    </section>
  );
};

export default page;
