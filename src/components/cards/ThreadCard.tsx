import Image from "next/image";
import Link from "next/link";

// import { formatDateString, formatTimeToNow } from "@/lib/utils";
import DeleteThread from "../forms/DeleteThread";
import { Image as AntImage } from "antd";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  createdAt: string;
  comments: {
    author: {
      image: string;
      name: string;
    };
  }[];
  isComment?: boolean;
}

function ThreadCard({ post, currentUserId }: any) {
  // const renderImages = () => {
  //   if (!content.images || content.images.length === 0) return null;

  //   const imageGridClass = images.length > 1 ? "grid-cols-2" : "grid-cols-1";

  //   return (
  //     <div className={`my-2 grid ${imageGridClass} gap-3`}>
  //       <AntImage.PreviewGroup>
  //         {images.map((image: any, index: any) => (
  //           <div key={index}>
  //             <AntImage
  //               alt="image"
  //               className="shadow-xl border aspect-[4/3] object-cover rounded-md"
  //               src={image}
  //             />
  //           </div>
  //         ))}
  //       </AntImage.PreviewGroup>
  //     </div>
  //   );
  // };

  // const renderComments = () => {
  //   if (isComment && comments.length > 0) {
  //     return (
  //       <div className="ml-1 mt-3 flex items-center gap-2">
  //         {comments.slice(0, 2).map((comment: any, index: any) => (
  //           <Image
  //             key={index}
  //             src={comment.author.image}
  //             alt={`user_${index}`}
  //             width={24}
  //             height={24}
  //             className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
  //           />
  //         ))}

  //         <Link href={`/thread/${id}`}>
  //           <p className="mt-1 text-subtle-medium text-gray-1">
  //             {comments.length} repl{comments.length > 1 ? "ies" : "y"}
  //           </p>
  //         </Link>
  //       </div>
  //     );
  //   }

  //   return null;
  // };

  return (
    <div className=""></div>
    // <article
    //   className={`flex w-full flex-col border-b ${
    //     isComment ? "px-0 xs:px-7" : "p-7"
    //   }`}
    // >
    //   <div className="flex items-start justify-between">
    //     <div className="flex w-full flex-1 flex-row gap-4">
    //       <div className="flex flex-col items-center">
    //         <Link href={`/profile/${authorId}`} className="relative h-11 w-11">
    //           <Image
    //             src={authorImage}
    //             alt="user_community_image"
    //             fill
    //             className="cursor-pointer rounded-full"
    //           />
    //         </Link>

    //         <div className="thread-card_bar bg-gray-300 dark:bg-gray-800" />
    //       </div>

    //       <div className="flex w-full flex-col">
    //         <div className="flex w-full justify-between ">
    //           <Link href={`/profile/${authorId}`} className="w-fit">
    //             <h4 className="cursor-pointer text-base-semibold">
    //               {authorName}
    //             </h4>
    //           </Link>
    //         </div>

    //         {text && <p className="mt-2 text-small-regular">{text}</p>}

    //         {renderImages()}

    //         <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
    //           <div className="flex gap-3.5">
    //             <Image
    //               src="/assets/heart-gray.svg"
    //               alt="heart"
    //               width={24}
    //               height={24}
    //               className="cursor-pointer object-contain"
    //             />
    //             <Link href={`/thread/${id}`}>
    //               <Image
    //                 src="/assets/reply.svg"
    //                 alt="heart"
    //                 width={24}
    //                 height={24}
    //                 className="cursor-pointer object-contain"
    //               />
    //             </Link>
    //             <Image
    //               src="/assets/repost.svg"
    //               alt="heart"
    //               width={24}
    //               height={24}
    //               className="cursor-pointer object-contain"
    //             />
    //             <Image
    //               src="/assets/share.svg"
    //               alt="heart"
    //               width={24}
    //               height={24}
    //               className="cursor-pointer object-contain"
    //             />
    //           </div>

    //           {isComment && comments.length > 0 && (
    //             <Link href={`/thread/${id}`}>
    //               <p className="mt-1 text-subtle-medium text-gray-1">
    //                 {comments.length} repl{comments.length > 1 ? "ies" : "y"}
    //               </p>
    //             </Link>
    //           )}
    //         </div>
    //       </div>
    //     </div>

    //     <div className="flex">
    //       <span className="text-sm text-muted-foreground pr-3">
    //         {/* {formatTimeToNow(new Date(createdAt))} */}
    //       </span>
    //       <span>
    //         {/* <DeleteThread
    //           threadId={JSON.stringify(id)}
    //           currentUserId={currentUserId}
    //           authorId={authorId}
    //           parentId={parentId}
    //           isComment={isComment}
    //           isAdmin={isAdmin}
    //         /> */}
    //       </span>
    //     </div>
    //   </div>

    //   {renderComments()}
    // </article>
  );
}

export default ThreadCard;
