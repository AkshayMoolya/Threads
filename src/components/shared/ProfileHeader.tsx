import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/badge";

interface Props {
  accountId: string;
  authUserId?: string;
  name: string;
  username: string;
  follower: any;
  imgUrl: string;
  bio: string;
  type?: string;
}

function ProfileHeader({
  accountId,
  authUserId,
  name,
  username,
  follower,
  imgUrl,
  bio,
  type,
}: Props) {
  return (
    <div>
      <div className=" flex flex-col sm:space-y-3">
        <div className=" mt-3 flex justify-between items-center">
          <div>
            <div className="text-heading2-semibold ">{name}</div>
            <div className="flex space-x-2 ">
              <div className="text-base-regular">@{username}</div>
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
          <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-600">
            <Image
              src={imgUrl}
              className="object-cover"
              alt={name}
              height={56}
              width={56}
            />
          </div>
        </div>
        <div>
          <p className=" whitespace-pre">{bio}</p>
        </div>
        <Link href={`/${accountId}`} className=" text-muted-foreground">
          {follower.length} followers
        </Link>
      </div>
    </div>
  );
}

export default ProfileHeader;
