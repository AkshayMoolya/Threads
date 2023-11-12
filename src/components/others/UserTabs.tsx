"use client";

import { startTransition, useEffect, useState, useTransition } from "react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { followUser, unfollowUser } from "@/lib/actions/user.actions";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import EditProfile from "../forms/EditProfile";
import { Prisma, users } from "@prisma/client";

interface Props {
  user: users;
  currentUserId: string;
  currentUser: boolean;
  allUsernames: string[];
}

const UserTabs = ({
  currentUserId,
  user,
  currentUser,
  allUsernames,
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const [isFollowing, setIsfollowing] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (user?.followersIds.includes(currentUserId)) {
      setIsfollowing(true);
    }
  }, [user?.followersIds, currentUserId]);

  const shareProfile = () => {
    const shareData: ShareData = {
      title: "Threads",
      text: `Check out ${name}'s (@${user?.username}) on Threads`,
      url: `http://localhost:3000/profile/${user?.username}`,
    };
    if (navigator.share) navigator.share(shareData);
  };

  return (
    <div>
      {currentUser ? (
        <div className=" flex space-x-2  mt-4 text-small-semibold">
          <EditProfile userData={user} allUsernames={allUsernames} />

          <Button
            onClick={shareProfile}
            size="lg"
            className="w-full rounded-xl"
            variant="outline"
          >
            Share profile
          </Button>
        </div>
      ) : (
        <Button
          onClick={(e) => {
            e.preventDefault();
            toast({
              title: isFollowing ? "Unfollowed " + name : "Followed " + name,
            });
            startTransition(() => {
              if (isFollowing) {
                unfollowUser({
                  userId: currentUserId,
                  followingId: user?.id,
                  pathname,
                });
              } else {
                followUser({
                  userId: currentUserId,
                  followingId: user?.id,
                  pathname,
                });
              }
            });
          }}
          className="w-full"
          variant="outline"
        >
          {isPending ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : isFollowing ? (
            "Following"
          ) : (
            "Follow"
          )}
        </Button>
      )}
    </div>
  );
};

export default UserTabs;
