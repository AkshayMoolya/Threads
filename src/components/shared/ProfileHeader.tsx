import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { buttonVariants } from "../ui/button";
import { BsInstagram } from "react-icons/bs";
import { Prisma, users } from "@prisma/client";

interface Props {
  authUserId: string;
  user: users;
}

function ProfileHeader({ authUserId, user }: Props) {
  return (
    <div className="sm:mt-4">
      <div className=" flex flex-col space-y-3">
        <div className=" flex justify-between items-center">
          <div>
            <div className="text-heading2-semibold ">{user?.name}</div>
            <div className="flex space-x-2 ">
              <div className="text-base-regular">{user?.username}</div>
              <div className="">
                <Badge
                  className=" text-muted-foreground rounded-full sm:text-base-regular text-[10px] font-semibold text-gray-500 "
                  variant="secondary"
                >
                  threads.net
                </Badge>
              </div>
            </div>
          </div>
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-neutral-600">
            <Image
              src={user?.image}
              className="object-cover "
              fill
              alt={user?.name}
            />
          </div>
        </div>
        <div>
          <p className="whitespace-pre-wrap max-w-xs xs:max-w-md text-small-regular sm:text-small-regular">
            {user?.bio}
          </p>
        </div>
        <div className="w-full flex justify-between">
          <Link href={`/${user?.id_}`} className=" text-muted-foreground">
            {user?.followersIds.length} followers
          </Link>
          <Link
            className={buttonVariants({ size: "icon", variant: "ghost" })}
            href="https://instagram.com"
          >
            <BsInstagram className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
