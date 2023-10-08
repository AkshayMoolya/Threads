"use client";

import { sidebarLinks } from "@/constants";
import { IconLogout2 } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignedIn, SignOutButton, useAuth } from "@clerk/nextjs";
import Logo from "../Logo/Logo";
import { useEffect, useState } from "react";

type LeftSideBarProps = {
  notification: number; // Assuming this is a number representing the notification count
};


const LeftSideBar = ({ notification }: LeftSideBarProps) => {
  const [notificationCount, setNotificationCount] = useState(notification);
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();

  useEffect(() => {
    setNotificationCount(notification);
  }, [notification]);

  return (
    <section className="custom-scrollbar leftsidebar sticky ">
      <div className="flex w-full flex-1 flex-col gap-6 px-6 ">
        <Logo />
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          if (link.route === "/profile") link.route = `${link.route}/${userId}`;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link items-center ${
                isActive && "bg-primary-500"
              }`}
            >
              <link.icon />
              {link.route === "/notifications" && notificationCount !== 0 && (
                <span className=" text-[10px] bottom-0 aspect-square w-5 h-5 flex text-white justify-center items-center  right-5 bg-red-500 rounded-full p-1 absolute">
                  <p>{notificationCount}</p>
                </span>
              )}
              <p className=" max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>
      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <div className="flex cursor-pointer gap-4 p-4">
              <IconLogout2 />
              <p className=" max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSideBar;
