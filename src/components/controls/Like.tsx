"use client";
import { FC, useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";

import { Heart } from "lucide-react";
import { likeThread } from "@/lib/actions/thread.action";

const Like = ({ data, user, threadId, likes }: any) => {
  const [liked, setLiked] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  useEffect(() => {
    if (user) {
      if (likes && likes.includes(user.id)) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    }
  }, [user]);

  const handleLike = () => {
    // vibrate the device if possible
    if (typeof window !== "undefined") {
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }

    const wasLiked = liked;
    setLiked(!liked);

    if (user) {
      if (!wasLiked) {
        startTransition(() =>
          likeThread({
            thread: threadId,
            userId: user.id,
            pathname,
          })
        );
      } else {
        // startTransition(() =>
        //   unlikeThread(thread.id, user.id, threadId, pathname)
        // );
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
