"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Quote, Repeat2 } from "lucide-react";
import { FC } from "react";
import { toast } from "../ui/use-toast";

interface RepostProps {}

const Repost = ({}) => {
  const repostThread = () => {
    console.log("repost");
    toast({
      description: "Repost feature coming soon",
    });
  };

  const quoteThread = () => {
    console.log("quote");
    toast({
      description: "Quote feature coming soon",
    });
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Repeat2 className=" h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" bg-background">
          <DropdownMenuItem onClick={repostThread}>
            {" "}
            <Repeat2 className=" mr-2" size={18} /> Repost{" "}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={quoteThread}>
            <Quote className=" mr-2" size={16} /> Quote
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Repost;
