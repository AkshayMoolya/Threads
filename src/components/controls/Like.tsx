"use client";
import { FC, useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";

import { Heart } from "lucide-react";
import { likeThread, unlikeThread } from "@/lib/actions/thread.action";
import { users } from "@prisma/client";
import { User } from "@clerk/clerk-sdk-node";

interface LikeProps {
  data: users;
  user: User | null;
  threadId: string;
  likes: {
    id: string;
    createdAt: Date;
    id_: string;
    threadId: string;
    userId: string;
  } | null;
}

const Like = ({ data, user, threadId, likes }: LikeProps) => {
  const [liked, setLiked] = useState(false);
  const [likeData, setLikeData] = useState(likes);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  useEffect(() => {
    if (likes) {
      setLikeData(likes);
    }
  }, [likes]);

  useEffect(() => {
    if (user) {
      if (likes) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    }
  }, [user, likeData]);

  const handleLike = () => {
    // vibrate the device if possible
    if (typeof window !== "undefined") {
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }

    setLiked(!liked);
    const wasLiked = liked;

    if (user) {
      if (!wasLiked) {
        startTransition(() =>
          likeThread({
            thread: threadId,
            userId: data.id,
            id: user.id,
            pathname,
          })
        );
      } else if (likeData) {
        startTransition(() =>
          unlikeThread({
            thread: threadId,
            userId: data.id,
            id: likeData.id,
            pathname,
          })
        );
      }
    }
  };
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        handleLike();
      }}
      className={`w-5 duration-200 h-5 ${liked ? "text-red-600" : ""}`}
    >
      <Heart fill={liked ? "#dc2626" : "transparent"} className="w-5 h-5" />
    </button>
  );
};

export default Like;
