import Image from "next/image";
import { currentUser } from "@clerk/nextjs";

import {
  fetchUser,
  fetchUserByName,
  fetchUserPosts,
} from "@/lib/actions/user.actions";
import Link from "next/link";
import ThreadCard from "@/components/cards/Threadcard";

async function Page({ params }: { params: { username: string } }) {
  const user = await currentUser();

  const userInfo = await fetchUserByName(params.username);

  if (!userInfo?.onboarded) return null;

  const userPost = await fetchUserPosts(userInfo.id);

  // console.log(userPost[0].likes);

  return (
    <section className="px-2 sm:p-0">
      <div className="w-full mt-4 flex px-2 sm:px-0">
        <button className="w-full h-10 py-2 font-semibold border-b border-b-gray-400 dark:border-b-white text-center">
          Threads
        </button>
        <Link
          href={`/profile/${userInfo.username}/replies`}
          className="w-full h-10 py-2 font-medium border-b border-background duration-200 hover:border-gray-600 hover:text-neutral-500 text-center text-neutral-600"
        >
          Replies
        </Link>
      </div>
      {userPost?.length === 0 ? (
        <div className="text-neutral-600 mt-4 text-center leading-loose">
          No threads posted yet.
        </div>
      ) : (
        userPost.map((post) => (
          <ThreadCard
            key={post.author.id}
            currentUserId={user?.id}
            post={post}
            parent
            isCurrentUserAdmin={userInfo.isAdmin}
            isComment
          />
        ))
      )}
    </section>
  );
}
export default Page;

// {
//   <Tabs defaultValue="threads" className="w-full">
//     <TabsList className="tab">
//       {profileTabs.map((tab) => (
//         <TabsTrigger key={tab.label} value={tab.value} className="tab">
//           <Image
//             src={tab.icon}
//             alt={tab.label}
//             width={24}
//             height={24}
//             className="object-contain"
//           />
//           <p className="max-sm:hidden">{tab.label}</p>

//           {tab.label === "Threads" && (
//             <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
//               {userInfo.threads.length}
//             </p>
//           )}
//         </TabsTrigger>
//       ))}
//     </TabsList>
//     {profileTabs.map((tab) => (
//       <TabsContent
//         key={`content-${tab.label}`}
//         value={tab.value}
//         className="w-full text-light-1"
//       >
//         {/* @ts-ignore */}
//         <ThreadsTab
//           currentUserId={user?.id}
//           accountId={userInfo.id}
//           accountType="User"
//         />
//       </TabsContent>
//     ))}
//   </Tabs>
// }
