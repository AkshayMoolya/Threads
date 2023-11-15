import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import React from "react";
import Comment from "@/components/forms/Comment";
import Newcard from "@/components/cards/newcard";
import PostThread from "@/components/forms/PostThread";
import Reply from "@/components/forms/Reply";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { metaTagsGenerator } from "@/lib/utils";

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const thread = await db.threads.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
    },
  });

  return metaTagsGenerator({
    title: `Checkout this thread by ${thread?.author.name}`,
    url: `/thread/${id}`,
  });
}

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  if (!thread) return null;

  return (
    <section className="relative">
      <div>
        <Newcard
          key={thread?.id}
          currentUserId={user.id || ""}
          post={thread}
          parent={true}
          isComment={false}
          isCurrentUserAdmin={userInfo.isAdmin}
        />
      </div>

      <div className="mt-7">
        <Reply threadId={params.id} userInfo={userInfo} isReply />
      </div>

      <div className="mt-10">
        {thread?.children.map((childItem) => (
          // console.log(childItem)
          <Newcard
            key={childItem.id}
            currentUserId={user.id}
            post={childItem}
            parent
            isComment={true}
            isCurrentUserAdmin={userInfo.isAdmin}
          />
        ))}
      </div>
      <div className="w-full h-20"></div>
    </section>
  );
};

export default page;
