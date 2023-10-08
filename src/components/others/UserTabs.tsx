"use client";

import { startTransition, useEffect, useState, useTransition } from "react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { followUser, unfollowUser } from "@/lib/actions/user.actions";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

type UserTabsProps = {
  follower: string[]; // Assuming this is an array of follower IDs
  name: string;
  id: string;
  currentUserId: string;
  following: string[]; // Assuming this is an array of following IDs
  currentUser: boolean;
  username: string;
};

type ShareData = {
  title: string;
  text: string;
  url: string;
};

const UserTabs = ({
  follower,
  name,
  id,
  currentUserId,
  following,
  currentUser,
  username,
}: UserTabsProps) => {
  const [isPending, startTransition] = useTransition();
  const [isFollowing, setIsfollowing] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (follower.includes(currentUserId)) {
      setIsfollowing(true);
    }
  }, [follower, currentUserId]);

  const EditProfile = () => {
    router.push("/profile/edit");
  };
  const shareProfile = () => {
    const shareData: ShareData = {
      title: "Threads",
      text: `Check out ${name}'s (@${username}) on Threads`,
      url: `http://localhost:3000/profile/${id}`,
    };
    if (navigator.share) navigator.share(shareData);
  };

  return (
    <div>
      {currentUser ? (
        <div className=" flex space-x-2  mt-4 text-small-semibold">
          <Button
            onClick={EditProfile}
            size="lg"
            className="w-full rounded-xl"
            variant="outline"
          >
            Edit Profile
          </Button>

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
                unfollowUser({ userId: id, followingId: id, pathname });
              } else {
                followUser({ userId: id, followingId: id, pathname });
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
