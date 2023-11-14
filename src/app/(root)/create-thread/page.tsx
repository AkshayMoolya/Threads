import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import CreateThreadMobile from "@/components/forms/CreateThreadMobile";

async function Page() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <div className="p-4 sm:p-0 sm:mt-9">
      <h1 className=" text-body-semibold pb-3">Create Thread</h1>

      <CreateThreadMobile
        authUserId={user.id}
        userInfo={userInfo}
        isReply={false}
      />
    </div>
  );
}

export default Page;
