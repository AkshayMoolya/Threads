"use client";

import { sidebarLinks } from "@/constants";
import { IconLogout2 } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignedIn, SignOutButton, useAuth } from "@clerk/nextjs";
import Logo from "../Logo/Logo";

const LeftSideBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();
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
              <link.icon className="w-7 h-7" />
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
