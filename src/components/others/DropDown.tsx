import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { SignOutButton, SignedIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { TbMenuDeep } from "react-icons/tb";
const DropDown = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const switchTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          className=" outline-none w-full h-full"
          variant="link"
          size={"icon"}
        >
          <TbMenuDeep
            className=" text-muted-foreground hover:text-black dark:hover:text-white"
            size={28}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={switchTheme}>
          Switch Appearence
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            target="_blank"
            href="mailto:akshaymoolya88@gmail.com?subject=Bug%20Report%20for%20Threads%20Application"
          >
            Report a bug
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a target="_blank" href="https://Akshay33.vercel.app">
            About Me
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <div className="">
            <SignedIn>
              <SignOutButton signOutCallback={() => router.push("/sign-in")}>
                <p>Logout</p>
              </SignOutButton>
            </SignedIn>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDown;
