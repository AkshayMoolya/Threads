import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Pagination from "@/components/shared/Pagination";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchPosts, getUserThread } from "@/lib/actions/thread.action";
import Newcard from "@/components/cards/newcard";
import { Post } from "@/lib/datatypes/datatypes";
import { Prisma } from "@prisma/client";

async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const userdata = await currentUser();

  const user = JSON.parse(JSON.stringify(userdata));
  if (!user) {
    redirect("/sign-in");
  }

  type post = {
    id: string;
    authorId: string;
    content: Prisma.JsonValue;
    id_: string;
    parentId: string | null;
    createdAt: Date;
  };

  const userInfo = await fetchUser(user.id);
  // const newInf = await getUserThread(user.id);

  // console.log(userInfo);

  const result = await fetchPosts(
    searchParams.page ? +searchParams.page : 1,
    20
  );

  // console.log("this", result, "end");

  return (
    <>
      <section className="mt-9 flex flex-col ">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              // console.log("this", post, "end")
              <Newcard
                key={post.id}
                isCurrentUserAdmin={userInfo?.isAdmin}
                currentUserId={user.id}
                parent={false}
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
