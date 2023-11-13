"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useEffect, useState } from "react";
import FollowButton from "../others/FollowButton";
import { nFormatter } from "@/lib/utils";
import { users } from "@prisma/client";

interface Props {
  currentUserId: string;
  person: users;
}

function UserCard({ currentUserId, person }: Props) {
  const [isFollowing, setIsfollowing] = useState(false);

  const router = useRouter();

  const handleClick: MouseEventHandler<HTMLDivElement> = () => {
    router.push(`/profile/${person.username}`);
  };

  useEffect(() => {
    if (person.followersIds.includes(currentUserId)) {
      setIsfollowing(true);
    }
  }, [person.followersIds, currentUserId]);

  return (
    <article className="user-card  ">
      <div className="user-card_avatar">
        <div className="relative h-9 w-9 sm:h-12 sm:w-12">
          <Image
            src={person.image}
            alt="user_logo"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="border-b flex flex-1 pb-3 ">
          <div
            className="flex-1 text-ellipsis cursor-pointer "
            onClick={handleClick}
          >
            <h4 className="text-base-semibold cursor-pointer ">
              {person.name}
            </h4>
            <p className="text-small-medium text-gray-1 font-bold">
              @{person.username}
            </p>
            <p className="mt-2 text-small-regular ">
              {" "}
              {nFormatter(person.followersIds.length, 1)}{" "}
              {person.followersIds.length === 1 ? "follower" : "followers"}
            </p>
          </div>
          <div className="mt-2 text-sm"></div>
          <FollowButton
            isFollowing={isFollowing}
            name={person.name}
            id={currentUserId}
            followingId={person.id}
          />
        </div>
      </div>
    </article>
  );
}

export default UserCard;
