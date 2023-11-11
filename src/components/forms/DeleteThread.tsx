"use client";

import { deleteThread } from "@/lib/actions/thread.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Flag, Loader2, MoreHorizontal, Trash, UserX2 } from "lucide-react";
import { toast } from "../ui/use-toast";

interface Props {
  threadId: string;
  currentUserId: string | undefined;
  authorId: string;
  parentId?: string | null;
  isComment?: boolean;
  isAdmin: boolean | undefined;
}

function DeleteThread({
  threadId,
  currentUserId,
  authorId,
  parentId,
  isComment,
  isAdmin,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [deleted, setDeleted] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (deleted && !isPending) {
      toast({
        title: "Thread deleted",
      });
      setOpen(false);
      setDeleted(!deleted);
      // if (pathname.startsWith("/thread")) {
      //   router.push("/");
      // }
    }
  }, [deleted, isPending]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen((prev) => !prev);
        }}
      >
        {" "}
        <MoreHorizontal className="w-5 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" bg-background" align="end">
        {currentUserId === authorId || isAdmin ? (
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              setDeleted(true);
              startTransition(() =>
                deleteThread(JSON.parse(threadId), pathname)
              );
            }}
            disabled={deleted}
            className="!text-red-500"
          >
            {" "}
            {deleted ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash className="w-4 h-4 mr-2" />
            )}
            Delete
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem
              onClick={(e) => {
                toast({
                  title: name + " has been blocked",
                });
                setOpen(false);
              }}
            >
              <UserX2 className="w-4 h-4 mr-2" />
              Block
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                toast({
                  title: name + " has been reported",
                });
                setOpen(false);
              }}
              className="!text-red-500"
            >
              {" "}
              <Flag className="w-4 h-4 mr-2" />
              Report
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DeleteThread;
