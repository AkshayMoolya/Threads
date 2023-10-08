import { MessageCircleIcon } from "lucide-react";
import Link from "next/link";

interface CommentProps {
  id: string;
}

const Comment = ({ id }: CommentProps) => {
  return (
    <Link href={`/thread/${id}`}>
      <MessageCircleIcon className="w-5 h-5" />
    </Link>
  );
};

export default Comment;
