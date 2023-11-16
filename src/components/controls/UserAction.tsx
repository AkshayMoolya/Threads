import { fetchUser } from "@/lib/actions/user.actions";

import { redirect } from "next/navigation";
import Like from "./Like";
import Comment from "./Comment";
import Share from "./Share";
import Repost from "./Repost";
import { likes } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

interface Props {
  threadId: string;
  Likes: likes[] | null;
  username: string;
}

const UserAction = async ({ threadId, Likes, username }: Props) => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const likewhereuserid = Likes && Likes.filter((like) => like.id_ === user.id);

  const likeData = likewhereuserid && likewhereuserid[0];

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  return (
    <div className="flex gap-3.5">
      <Like
        data={userInfo}
        user={JSON.parse(JSON.stringify(user))}
        threadId={threadId}
        likes={likeData}
      />
      <Comment id={threadId} />
      <Repost />
      <Share threadId={threadId} username={username} />
    </div>
  );
};

export default UserAction;
