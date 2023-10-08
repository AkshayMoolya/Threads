import AuthorNameLink from "@/components/others/AuthorNameLink";
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
    <div className=" sm:mt-9">
      <div className="flex w-full text-heading3-bold items-center sm:pb-6 p-4 sm:p-0 ">
        <Link href={"/amazing"} className="pr-5">
          <X className="h-7 w-7" />
        </Link>
        <AuthorNameLink
          username={userInfo.name}
          id={userInfo.id}
          role={userInfo.isAdmin}
        />
      </div>
      {children}
    </div>
  );
};

export default layout;
