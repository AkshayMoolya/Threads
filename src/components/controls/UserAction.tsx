import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Like from "./Like";

const UserAction = async ({ threadId, Likes }: any) => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }
  const likes = Likes.map((like: any) => like.userId);
  return <Like data={userInfo} user={user} threadId={threadId} likes={likes} />;
};

export default UserAction;
