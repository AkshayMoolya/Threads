import UserTabs from "@/components/others/UserTabs";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { buttonVariants } from "@/components/ui/button";
import { fetchUser, fetchUserByName } from "@/lib/actions/user.actions";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FC } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { BsInstagram } from "react-icons/bs";

interface layoutProps {
  params: {
    id: string;
  };
  children: React.ReactNode;
}

const layout: FC<layoutProps> = async ({ params, children }) => {
  const { id } = params;
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userInfo = await fetchUserByName(id);

  const allUsernames = await db.users.findMany({
    select: {
      username: true,
    },
  });

  const isUser = userInfo?.id_ === user?.id;

  return (
    <>
      {/* <div className=" relative px-4 sm:p-0 w-[640px]  ">
        <div className=" flex justify-end space-x-3 py-3 ">
          <div>
            <a
              className={buttonVariants({ size: "icon", variant: "ghost" })}
              href="https://instagram.com"
            >
              <BsInstagram className="w-6 h-6" />
            </a>
          </div>
          <Link
            className={buttonVariants({
              size: "icon",
              variant: "ghost",
            })}
            href="/settings"
          >
            <AiOutlineSetting className="w-7 h-7" />
          </Link>
        </div>
      </div> */}
      <section className="px-4 sm:p-0 ">
        <ProfileHeader user={userInfo} authUserId={user?.id} />

        <div className="sm:mt-5">
          <UserTabs
            user={userInfo}
            currentUserId={userInfo?.id_}
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
