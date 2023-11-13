"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";

import Link from "next/link";
import { formatTimeToNow } from "@/lib/utils";
import { StarIcon, User2Icon, UserIcon } from "lucide-react";
import AuthorNameLink from "../others/AuthorNameLink";
import FollowButton from "../others/FollowButton";
import { markAllUnreadNotificationsAsRead } from "@/lib/actions/notification.actions";
import { Heart } from "react-iconly";
import { usePathname } from "next/navigation";
import { Prisma, notifications, threads, users } from "@prisma/client";

interface NotificationProps {
  data: Prisma.notificationsGetPayload<{
    include: {
      userWhotriggered: true;
      user: true;
      thread: true;
    };
  }>;
  currentUser: users;
}

const Notification = ({ currentUser, data }: NotificationProps) => {
  const pathname = usePathname();
  const [following, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!data.isRead) {
      markAllUnreadNotificationsAsRead({
        userId: currentUser.id,
        path: pathname,
      });
    }
  }, [data.isRead, currentUser.id, pathname]);

  useEffect(() => {
    if (
      data.userWhotriggered &&
      currentUser.followersIds.includes(data?.userWhotriggered?.id)
    ) {
      setIsFollowing(true);
    }
  }, [currentUser.followersIds, following]);

  if (data.userWhotriggered && data.type === "LIKE") {
    return (
      <Link href={`/thread/${data?.thread?.id}`}>
        <div className=" py-4 border-b items-center flex space-x-3">
          <div className=" relative">
            <Image
              className=" aspect-square object-cover rounded-full"
              alt={data.userWhotriggered.name}
              src={data?.userWhotriggered.image}
              width="40"
              height="40"
            />
            <div className=" flex justify-center items-center absolute rounded-full p-1 border-2 border-background -right-1 -bottom-1 bg-red-600 ">
              <Heart size={12} filled primaryColor="#fff" />
            </div>
          </div>
          <div className=" grow">
            <div className=" flex space-x-2 items-center ">
              <AuthorNameLink
                name={data?.userWhotriggered?.name}
                username={data?.userWhotriggered?.username}
                role={data?.userWhotriggered?.isAdmin}
              />
              <span className=" text-muted-foreground text-sm">
                {formatTimeToNow(data.createdAt)}
              </span>
            </div>

            <span className="text-muted-foreground -mt-1 text-sm line-clamp-1 ">
              {/* @ts-ignore */}
              {data.thread?.content?.text || "liked your post"}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (data.userWhotriggered && data.type === "FOLLOW") {
    return (
      <div className=" flex justify-between border-b w-full items-center ">
        <Link href={`/${data?.user?.id}`}>
          <div className=" py-4  items-center flex space-x-3">
            <div className=" relative">
              <Image
                className=" aspect-square object-cover rounded-full"
                alt={data?.userWhotriggered?.name}
                src={data?.userWhotriggered?.image}
                width="40"
                height="40"
              />
              <div className=" flex justify-center items-center absolute rounded-full p-1 border-2 border-background -right-1 -bottom-1 bg-violet-600 ">
                <User2Icon size={12} fill="#fff" />
              </div>
            </div>
            <div className=" grow">
              <div className=" flex space-x-2 items-center ">
                <AuthorNameLink
                  name={data?.userWhotriggered?.name}
                  username={data?.userWhotriggered?.username}
                  role={data?.userWhotriggered?.isAdmin}
                />
                <span className=" text-muted-foreground text-sm">
                  {formatTimeToNow(data.createdAt)}
                </span>
              </div>

              <span className="text-muted-foreground -mt-1 text-sm line-clamp-1 ">
                Followed you
              </span>
            </div>
          </div>
        </Link>

        <FollowButton
          isFollowing={following}
          name={data?.userWhotriggered?.name}
          id={currentUser.id}
          followingId={data?.userWhotriggered?.id}
        />
      </div>
    );
  }

  if (data.userWhotriggered && data.type === "COMMENT") {
    return (
      <Link href={`/thread/${data?.thread?.id}`}>
        <div className=" py-4 border-b items-center flex space-x-3">
          <div className=" relative">
            <Image
              className=" aspect-square object-cover rounded-full"
              alt={data?.userWhotriggered?.name}
              src={data?.userWhotriggered?.image}
              width="40"
              height="40"
            />
            <div className=" flex justify-center items-center absolute rounded-full p-1 border-2 border-background -right-1 -bottom-1 bg-blue ">
              <StarIcon size={12} fill="#fff" />
            </div>
          </div>
          <div className=" grow">
            <div className=" flex space-x-2 items-center">
              <AuthorNameLink
                name={data?.userWhotriggered?.name}
                username={data?.userWhotriggered?.username}
                role={data?.userWhotriggered?.isAdmin}
              />
              <span className=" text-muted-foreground text-sm">
                {formatTimeToNow(data.createdAt)}
              </span>
            </div>
            <span className="text-muted-foreground -mt-1 text-sm line-clamp-1 ">
              Replied to your post
            </span>
            <span className="  text-sm line-clamp-1 ">
              {/* @ts-ignore */}
              {data?.thread?.content?.text}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return <div></div>;
};

export default Notification;
