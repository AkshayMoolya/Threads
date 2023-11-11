import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/shared/Searchbar";
import Pagination from "@/components/shared/Pagination";

import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";

async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchUsers({
    userId: user.id,
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  return (
    <>
      <section className="p-4 sm:p-0 sm:pt-9  ">
        {/* <h1 className="head-text pb-2">Search</h1> */}
        <Searchbar routeType="search" />

        <div className="mt-8 flex flex-col gap-9">
          {result.users.length === 0 ? (
            <p className="no-result">No Result</p>
          ) : (
            <>
              {result.users.map((person) => (
                // console.log(person)
                <UserCard
                  key={person.id}
                  currentUserId={userInfo.id}
                  person={person}
                />
              ))}
            </>
          )}
        </div>

        <Pagination
          path="search"
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </section>
    </>
  );
}

export default Page;
