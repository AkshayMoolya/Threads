"use client";

import { UserCog } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// import verified from "/assets/verfied.png";

export default function AuthorNameLink({
  username,
  id,
  role,
}: {
  id: string;
  username: string;
  role?: boolean;
}) {
  return (
    <Link
      href={`/profile/${id}`}
      className=" flex items-center space-x-1 font-semibold"
    >
      <span>{username}</span>

      {role && (
        <div className=" flex items-center space-x-1">
          <Image
            src="/assets/verified.png"
            width={17}
            height={17}
            alt="verified"
          />
          <UserCog size={14} />
        </div>
      )}
    </Link>
  );
}
