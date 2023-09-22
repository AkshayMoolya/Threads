import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/badge";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type?: string;
}

function ProfileHeader({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  type,
}: Props) {
  return (
    <div>
      <div className=" flex flex-col space-y-3">
        <div className=" mt-3 flex justify-between items-center">
          <div>
            <div className="text-heading2-semibold font-semibold">{name}</div>
            <div className=" flex space-x-2 ">
              <div className="  ">@{username}</div>
              <div>
                <Badge
                  className=" text-muted-foreground rounded-full"
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
        <div className=" text-muted-foreground">followers</div>
      </div>
    </div>
  );
}

export default ProfileHeader;
