"use client";

import { IconLogout2 } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignedIn, SignOutButton, useAuth } from "@clerk/nextjs";
import Logo from "../Logo/Logo";
import { useEffect, useState } from "react";
import PostThread from "../forms/PostThread";
import { Button } from "../ui/button";
import DropDown from "../others/DropDown";
import { Key } from "lucide-react";
import { users } from "@prisma/client";
import { desktopLinks } from "@/constants";

interface Props {
  notification: number;
  authUserId: string;
  userInfo: users;
}

const TopBar = ({ notification, authUserId, userInfo }: Props) => {
  const [notificationCount, setNotificationCount] = useState(notification);
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();

  useEffect(() => {
    setNotificationCount(notification);
  }, [notification]);

  console.log("check this out", notification);

  return (
    <section className=" leftsidebar sticky bg-background ">
      <div className="flex w-full items-center justify-between p-3 sm:p-0 sm:h-24  ">
        <div className="w-4 sm:hidden"></div>
        <Logo />
        <div className="flex items-center justify-between max-md:hidden h-full w-2/4 ">
          {desktopLinks.map((link) => {
            const isActive =
              (pathname.includes(link.route) && link.route.length > 1) ||
              pathname === link.route;

            if (link.route === "/profile")
              link.route = `${link.route}/${userInfo.username}`;
            return (
              <>
                {link.type === "link" ? (
                  <Button
                    key={link.route}
                    variant="ghost"
                    className={`leftsidebar_link items-center w-3/4 h-3/4`}
                  >
                    <Link
                      className="flex items-center justify-center"
                      href={link.route}
                      key={link.label}
                    >
                      {isActive ? (
                        <link.icon stroke="bold" set="bold" size={28} />
                      ) : (
                        <link.icon primaryColor="gray" size={28} />
                      )}
                      {link.route === "/notifications" &&
                        notificationCount !== 0 && (
                          <span className=" top-2 aspect-square w-2 h-2 flex text-white justify-center items-center bg-red-500 rounded-full absolute"></span>
                        )}

                      {/* <p className=" max-lg:hidden">{link.label}</p> */}
                    </Link>
                  </Button>
                ) : (
                  <PostThread
                    authUserId={authUserId}
                    userInfo={userInfo}
                    isReply={false}
                  />
                  // <CreateButton />
                )}
              </>
            );
          })}
        </div>

        <DropDown />
      </div>
    </section>
  );
};

export default TopBar;
