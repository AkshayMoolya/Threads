import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Pagination from "@/components/shared/Pagination";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchPosts } from "@/lib/actions/thread.action";
import Newcard from "@/components/cards/newcard";
import { Post } from "@/lib/datatypes/datatypes";

async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  // console.log(userInfo);

  const result = await fetchPosts(
    searchParams.page ? +searchParams.page : 1,
    20
  );

  return (
    <>
      <section className="mt-9 flex flex-col">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result.posts.map((post: any) => (
              // console.log(post)
              <Newcard
                key={post.id}
                isCurrentUserAdmin={userInfo.isAdmin}
                currentUserId={user.id}
                parent
                isComment
                post={post}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />

      <div className="w-full h-20"></div>
    </>
  );
}

export default Home;
