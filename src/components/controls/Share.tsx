"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ClipboardCopy, Send, ShareIcon } from "lucide-react";
import { toast } from "../ui/use-toast";

type shareProps = {
  threadId: string;
  username: string;
};

const Share = ({ threadId, username }: shareProps) => {
  const copyToClipboard = () => {
    const link = `http://localhost:3000//thread/${threadId}`;
    navigator.clipboard.writeText(link);
    toast({
      description: "Link copied to clipboard",
    });
  };

  const shareToOthers = () => {
    const shareData = {
      title: "Threads",
      text: `Check out this thread by ${username} on Threads`,
      url: `http://localhost:3000//thread/${threadId}`,
    };

    if (navigator.share) navigator.share(shareData);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Send className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" bg-background">
        <DropdownMenuLabel>Share</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyToClipboard}>
          {" "}
          <ClipboardCopy className=" mr-2" size={18} /> Copy link{" "}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToOthers}>
          <ShareIcon size={18} className=" mr-2" />
          Share via..
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Share;
