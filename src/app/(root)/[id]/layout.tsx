import AuthorNameLink from "@/components/others/AuthorNameLink";
import CancelBurtton from "@/components/shared/CancelBurtton";
import { Button } from "@/components/ui/button";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { X } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FC } from "react";

interface layoutProps {
  params: {
    id: string;
  };
  children: React.ReactNode;
}

const layout: FC<layoutProps> = async ({ params, children }) => {
  const { id } = params;
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userInfo = await fetchUser(id);
  const currentUserData = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");
  return (
    <div className="sm:mt-4 px-4 sm:p-0">
      <div className="flex w-full text-heading3-bold items-center sm:pb-6  ">
        <CancelBurtton />
        <AuthorNameLink
          username={userInfo.username}
          name={userInfo.name}
          role={userInfo.isAdmin}
        />
      </div>
      {children}
    </div>
  );
};

export default layout;
