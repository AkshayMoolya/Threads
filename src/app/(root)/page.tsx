import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ThreadCard from "@/components/cards/ThreadCard";
import Pagination from "@/components/shared/Pagination";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchPosts } from "@/lib/actions/thread.action";
import Newcard from "@/components/newcard";

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

  const result = await fetchPosts(
    searchParams.page ? +searchParams.page : 1,
    30
  );

  return (
    <>
      <section className="mt-9 flex flex-col">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <Newcard
                key={post._id}
                id={post._id}
                parentId={post.parentId}
                content={post.content}
                author={post.author}
                createdAt={post.createdAt}
                comments={post.children}
                currentUserId={user.id}
                isAdmin={userInfo.isAdmin}
                isComment
                likes={post.likes}
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
    </>
  );
}

export default Home;
