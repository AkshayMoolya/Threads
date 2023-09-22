import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";

async function Page() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text mt-9">Create Thread</h1>

      <PostThread
        userId={userInfo._id as string}
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
        isReply={false}
      />
    </>
  );
}

export default Page;
