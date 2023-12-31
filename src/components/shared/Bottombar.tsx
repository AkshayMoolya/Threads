"use client";

import { mobileLinks } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PostThread from "../forms/PostThread";
import { notifications, users } from "@prisma/client";
import { useEffect, useState } from "react";

interface Props {
  notification: number;
  authUserId: string;
  userInfo: users;
}

const Bottombar = ({ notification, authUserId, userInfo }: Props) => {
  const [notificationCount, setNotificationCount] = useState(notification);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setNotificationCount(notification);
  }, [notification]);

  return (
    <section className="bottombar ">
      <div className="bottombar_container flex ">
        {mobileLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          if (link.route === "/profile")
            link.route = `${link.route}/${userInfo.username}`;

          return (
            <>
              {link.type === "link" ? (
                <Link
                  href={link.route}
                  key={link.label}
                  className={`bottombar_link `}
                >
                  {isActive ? (
                    <link.icon stroke="bold" set="bold" size={25} />
                  ) : (
                    <link.icon primaryColor="gray" size={25} />
                  )}
                  {link.route === "/notifications" &&
                    notificationCount !== 0 && (
                      <span className=" bottom-0 aspect-square w-[5px] h-[5px] flex text-white justify-center items-center bg-red-500 rounded-full  absolute"></span>
                    )}
                </Link>
              ) : (
                <PostThread
                  authUserId={authUserId}
                  userInfo={userInfo}
                  isReply={false}
                />
              )}
            </>
          );
        })}
      </div>
    </section>
  );
};

export default Bottombar;
