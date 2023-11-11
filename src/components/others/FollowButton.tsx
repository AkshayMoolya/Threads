import { useEffect, useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "../ui/use-toast";
import { followUser, unfollowUser } from "@/lib/actions/user.actions";

export default function FollowButton({
  isFollowing,
  name,
  id,
  followingId,
}: {
  isFollowing: boolean;
  name: string ;
  id: string;
  followingId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [following, setFollowing] = useState(false); // Initialize following based on isFollowing

  useEffect(() => {
    if (isFollowing) {
      setFollowing(true);
    }
  }, [isFollowing]);

  const pathname = usePathname();

  console.log(id, followingId);

  return (
    <Button
      onClick={() => {
        toast({
          title: following ? "Unfollowed " + name : "Followed " + name,
        });
        startTransition(() => {
          if (following) {
            unfollowUser({ userId: id, followingId, pathname });
            setFollowing(false);
          } else {
            followUser({ userId: id, followingId, pathname });
            setFollowing(true);
          }
        });
      }}
      variant="outline"
      size="sm"
      className="w-24"
    >
      {isPending ? (
        <Loader2 className="animate-spin w-4 h-4" />
      ) : following ? (
        "Following"
      ) : (
        "Follow"
      )}
    </Button>
  );
}
