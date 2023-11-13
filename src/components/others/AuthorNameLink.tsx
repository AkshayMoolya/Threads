"use client";

import { UserCog } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// import verified from "/assets/verfied.png";

interface Props {
  username: string | undefined;
  name: string | undefined;
  role?: boolean;
}

export default function AuthorNameLink({ username, name, role }: Props) {
  return (
    <Link
      href={`/profile/${username}`}
      className=" flex items-center space-x-1 text-body-bold"
    >
      <span>{name}</span>

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
