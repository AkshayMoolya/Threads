import { buttonVariants } from "@/components/ui/button";
import { IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import { AiOutlineSetting } from "react-icons/ai";
import { BsInstagram } from "react-icons/bs";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className=" relative px-4 sm:p-0  ">
        <div className=" flex justify-end space-x-3 py-3 ">
          <div>
            <a
              className={buttonVariants({ size: "icon", variant: "ghost" })}
              href="https://instagram.com"
            >
              <BsInstagram className="w-6 h-6" />
            </a>
          </div>
          <Link
            className={buttonVariants({
              size: "icon",
              variant: "ghost",
            })}
            href="/settings"
          >
            <AiOutlineSetting className="w-7 h-7" />
          </Link>
        </div>
      </div>
      {children}
    </>
  );
};

export default layout;
