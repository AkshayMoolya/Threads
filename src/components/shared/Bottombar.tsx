"use client";
import { sidebarLinks } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PostThread from "../forms/PostThread";
import { notifications, users } from "@prisma/client";

interface Props {
  notification: number;
  authUserId: string;
  userInfo: users;
}

const Bottombar = ({ notification, authUserId, userInfo }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <section className="bottombar ">
      <div className="bottombar_container flex ">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

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
