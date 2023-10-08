import Image from "next/image";
import Link from "next/link";
import ImageCard from "./ImgeCard";
import DeleteThread from "../forms/DeleteThread";
import ReplyerImages from "../others/ReplyerImages";
import UserAction from "../controls/UserAction";
import { formatTimeToNow } from "@/lib/utils";
import AuthorNameLink from "../others/AuthorNameLink";

interface Thread {
  _id: string;
  id: string;
  content: {
    text?: string;
    images?: string[];
  };
  author: {
    _id?: string;
    id: string;
    image: string;
    isAdmin: boolean;
    name: string;
  };
  parentId?: string;
  children: {
    _id: string;
    id: string;
    content: {
      text: string;
      images: string[];
    };
    author: {
      _id?: string;
      id: string;
    };
    parentId: string;
    children: string[];
    likes: string[];
    createdAt: string; // ISO date string
  }[];
  likes: {
    _id?: string;
    id: string;
    user: {
      _id?: string;
      id: string;
      image: string;
      isAdmin: boolean;
      name: string;
    };
    thread: string;
    createdAt: string; // ISO date string
  }[];
  createdAt: string; // ISO date string
}

interface Props {
  isCurrentUserAdmin: boolean;
  isComment: boolean;
  parent: boolean;
  currentUserId: string | undefined;
  post: Thread;
}

const Newcard: React.FC<Props> = ({
  isCurrentUserAdmin,
  isComment = false,
  post,
  parent = false,
  currentUserId,
}: Props) => {
  const renderImages = () => {
    if (!post.content.images || post.content.images.length === 0) return null;

    const imageGridClass =
      post.content.images.length > 1 ? "grid-cols-2" : "grid-cols-1";

    return <ImageCard imageGridClass={imageGridClass} content={post.content} />;
  };

  const renderComments = () => {
    if (isComment && post.children && post.children.length > 0) {
      return (
        <div className=" flex items-center gap-2">
          <ReplyerImages comments={post.children} />
        </div>
      );
    }

    return null;
  };

  return (
    <article
      className={`flex w-full  flex-col  sm:my-2   py-2 px-2  sm:px-0  ${
        isComment ? "px-0 xs:px-4" : "p-7"
      }`}
    >
      <div
        className={`flex items-start justify-between pb-2 ${
          post.children && !isComment ? "border-none" : "border-b "
        }`}
      >
        <div className="flex w-full flex-1 flex-row gap-2 sm:gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={`/profile/${post.author.id}`}
              className="relative h-9 w-9 sm:h-11 sm:w-11 mb-2"
            >
              <Image
                src={post.author.image}
                alt="user_community_image"
                fill
                className="cursor-pointer rounded-full object-cover"
              />
            </Link>

            {post.children && !isComment ? null : (
              <div className={` bg-border w-0.5 mb-2 grow`} />
            )}

            {post.children && !isComment ? (
              <div
                className={`w-0.5 grow rounded-full bg-border relative ${
                  post.children && !isComment ? "mb-2" : null
                }`}
              >
                <div className="-bottom-7 absolute right-0 w-4 h-8">
                  <Image
                    alt=""
                    src="/assets/loop.svg"
                    width={16}
                    height={32}
                    className="w-full hidden dark:block object-cover h-full"
                  />
                  <Image
                    alt=""
                    src="/assets/loop-light.svg"
                    width={16}
                    height={32}
                    className="w-full dark:hidden  object-cover h-full"
                  />
                </div>
              </div>
            ) : null}
            {!parent && post.children && renderComments()}
          </div>

          <div className="flex w-full flex-col">
            <div className="flex w-full justify-between ">
              <AuthorNameLink
                username={post.author.name}
                id={post.author.id}
                role={post.author.isAdmin}
              />
              {/* <Link href={`/profile/${author.id}`} className="w-fit">
                <h4 className="cursor-pointer text-base-semibold">
                  {author.name}
                </h4>
              </Link> */}
              <div className="flex">
                <span className="text-small-regular sm:text-sm text-muted-foreground pr-3">
                  {formatTimeToNow(new Date(post.createdAt))}
                </span>
                <span>
                  <DeleteThread
                    threadId={JSON.stringify(post._id)}
                    currentUserId={currentUserId}
                    authorId={post.author.id}
                    parentId={post.id}
                    isComment={isComment}
                    isAdmin={isCurrentUserAdmin}
                  />
                </span>
              </div>
            </div>

            {post.content.text && (
              <p className="mt-2 text-small-regular">{post.content.text}</p>
            )}

            {renderImages()}

            <div className={` mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <UserAction
                  threadId={post._id}
                  Likes={post.likes}
                  username={post.author.name}
                />
              </div>
              <div className="flex text-neutral-600 items-center space-x-2">
                {post.children && post.children.length > 0 ? (
                  <div>
                    {post.children.length}{" "}
                    {post.children.length === 1 ? "reply" : "replies"}
                  </div>
                ) : null}
                {post.children &&
                post.children.length > 0 &&
                post.likes.length > 0 ? (
                  <div className="w-1 h-1 rounded-full bg-neutral-600" />
                ) : null}
                {post.likes.length > 0 ? (
                  <div>
                    {post.likes.length}{" "}
                    {post.likes.length === 1 ? "like" : "likes"}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Newcard;
