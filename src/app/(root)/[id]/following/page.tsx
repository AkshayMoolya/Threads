import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/shared/Searchbar";
import { fetchFollowing, fetchUser } from "@/lib/actions/user.actions";
import Link from "next/link";

type Props = {
  params: {
    id: string;
  };
  searchParams: {
    [key: string]: string | undefined;
  };
};

const page = async ({ params, searchParams }: Props) => {
  const userInfo = await fetchUser(params.id);
  const result = await fetchFollowing({
    userId: userInfo._id,
    name: searchParams.q,
  });
  return (
    <div>
      <div className="w-full mt-4 flex ">
        <Link
          href={`/${params.id}`}
          className="w-full h-10 py-2 font-medium border-b border-background duration-200 hover:border-gray-600 hover:text-neutral-500 text-center text-neutral-600"
        >
          Followers
        </Link>
        <button className="w-full h-10 py-2 font-semibold border-b border-b-black dark:border-b-white  text-center">
          Following
        </button>
      </div>
      <div className="flex items-start justify-center p-4 text-neutral-700">
        {userInfo.following.length} following
      </div>
      <div className="">
        <Searchbar routeType={`${params.id}/following`} />
        <div className="mt-8 flex flex-col gap-9">
          {result.length === 0 ? (
            <p className="no-result">No Result</p>
          ) : (
            <>
              {result.map((person: any) => (
                // console.log(person)
                <UserCard
                  key={person.id}
                  currentUserId={userInfo._id}
                  person={person}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
