import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const user: User | null = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const allUsernames = await db.users.findMany({
    select: {
      username: true,
    },
  });

  const userInfo = await fetchUser(user.id);

  const userData = {
    id: user?.id,
    objectId: userInfo?.id || "",
    username: userInfo?.username || user.username || "",
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl,
  };

  return (
    <main className="mx-auto flex sm:min-w-[500px] flex-col justify-start px-2">
      <h1 className="head-text">onboarding</h1>
      <p className="mt-3 text-base-regular ">
        Complete your profile now to use Threads
      </p>
      <section className="mt-9 w-full">
        <AccountProfile
          user={userData}
          allUsernames={allUsernames.map((user) => user.username)}
          btnTitle="continue"
        />
      </section>
    </main>
  );
};

export default page;
