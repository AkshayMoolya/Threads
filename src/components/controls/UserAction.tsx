import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Like from "./Like";
import Comment from "./Comment";
import Share from "./Share";
import Repost from "./Repost";

const UserAction = async ({ threadId, Likes, username }: any) => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }
  const likes = Likes && Likes.map((like: any) => like?.user?.id);
  console.log(likes);

  return (
    <div className="flex gap-3.5">
      <Like data={userInfo} user={user} threadId={threadId} likes={likes} />
      <Comment id={threadId} />
      <Repost />
      <Share threadId={threadId} username={username} />
    </div>
  );
};

export default UserAction;
