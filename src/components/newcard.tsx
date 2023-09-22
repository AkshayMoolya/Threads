import Image from "next/image";
import Link from "next/link";

// import { formatDateString, formatTimeToNow } from "@/lib/utils";
// import DeleteThread from "../forms/DeleteThread";
import { Image as AntImage } from "antd";
import ImageCard from "./cards/ImgeCard";
import DeleteThread from "./forms/DeleteThread";
import ReplyerImages from "./others/ReplyerImages";
import UserAction from "./controls/UserAction";

interface Props {
  id: string;
  parentId: string | null;
  content: {
    images: string[];
    text: string;
  };
  author: {
    id: string;
    name: string;
    image: string;
  };
  comments: {
    author: {
      image: string;
    };
  }[];
  currentUserId: string;
  isComment: boolean;
  createdAt: Date;
  isAdmin: boolean;
  likes: any;
}

const Newcard = ({
  id,
  parentId,
  content,
  author,
  createdAt,
  comments,
  currentUserId,
  isComment = false,
  isAdmin,
  likes,
}: Props) => {
  const renderImages = () => {
    if (!content.images || content.images.length === 0) return null;

    const imageGridClass =
      content.images.length > 1 ? "grid-cols-2" : "grid-cols-1";

    return <ImageCard imageGridClass={imageGridClass} content={content} />;
  };

  const renderComments = () => {
    if (isComment && comments.length > 0) {
      return (
        <div className="ml-1  flex items-center gap-2">
          <ReplyerImages comments={comments} />
          {/* {comments.slice(0, 2).map((comment: any, index: any) => (
            <Image
              key={index}
              src={comment.author.image}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
            />
          ))} */}
        </div>
      );
    }

    return null;
  };

  return (
    <article
      className={`flex w-full  flex-col border-b my-3 py-2 ${
        isComment ? "px-0 xs:px-7" : "p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="user_community_image"
                fill
                className="cursor-pointer rounded-full object-cover"
              />
            </Link>

            <div className="thread-card_bar bg-gray-300 dark:bg-gray-800 mb-2" />
            {renderComments()}
          </div>

          <div className="flex w-full flex-col">
            <div className="flex w-full justify-between ">
              <Link href={`/profile/${author.id}`} className="w-fit">
                <h4 className="cursor-pointer text-base-semibold">
                  {author.name}
                </h4>
              </Link>
            </div>

            {content.text && (
              <p className="mt-2 text-small-regular">{content.text}</p>
            )}

            {renderImages()}

            <div className={` mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <UserAction threadId={id} Likes={likes} />
                <Link href={`/thread/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="heart"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>
                <Image
                  src="/assets/repost.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 my-3 text-subtle-medium text-gray-1">
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex">
          <span className="text-sm text-muted-foreground pr-3">
            {/* {formatTimeToNow(new Date(createdAt))} */}
          </span>
          <span>
            <DeleteThread
              threadId={JSON.stringify(id)}
              currentUserId={currentUserId}
              authorId={author.id}
              parentId={parentId}
              isComment={isComment}
              isAdmin={isAdmin}
            />
          </span>
        </div>
      </div>
    </article>
  );
};

export default Newcard;
