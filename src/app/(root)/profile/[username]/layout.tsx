import UserTabs from "@/components/others/UserTabs";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { buttonVariants } from "@/components/ui/button";
import { fetchUser, fetchUserByName } from "@/lib/actions/user.actions";
import { db } from "@/lib/db";
import { metaTagsGenerator } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { IconSettings } from "@tabler/icons-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FC } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { BsInstagram } from "react-icons/bs";

export async function generateMetadata({
  params: { username },
}: {
  params: { username: string };
}) {
  const user = await db.users.findUnique({
    where: {
      username: username,
    },
  });

  return metaTagsGenerator({
    title: `${user?.name} (@${user?.username}) on Threads`,
    description: user?.bio || "",
    img: user?.image,
    url: `/profile/${username}`,
  });
}

interface layoutProps {
  params: {
    username: string;
  };
  children: React.ReactNode;
}

const layout: FC<layoutProps> = async ({ params, children }) => {
  const { username } = params;
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const currentUserInfo = await fetchUser(user.id);

  const userInfo = await fetchUserByName(username);

  if (!userInfo || !currentUserInfo) {
    redirect("/404");
  }

  const allUsernames = await db.users.findMany({
    select: {
      username: true,
    },
  });

  const isUser = userInfo?.id_ === user?.id;

  return (
    <>
      <section className="px-4 sm:p-0 ">
        <ProfileHeader user={userInfo} authUserId={user?.id} />

        <div className="sm:mt-5">
          <UserTabs
            user={userInfo}
            currentUserId={currentUserInfo?.id}
            currentUser={isUser}
            allUsernames={allUsernames.map((user) => user.username)}
          />
        </div>
      </section>
      {children}
      <div className="w-full h-20"></div>
    </>
  );
};

export default layout;
