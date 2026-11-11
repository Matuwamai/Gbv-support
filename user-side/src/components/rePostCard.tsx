import { BiRepost } from "react-icons/bi";
import type { Repost } from "../types";
import Avatar from "./Avatar";
import PostMedia from "./PostMedia";

const RepostCard = ({ repost }: { repost: Repost }) => {
  const original = repost.post;

  return (
    <article className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-100 w-full">
      <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
        <BiRepost className="text-xl text-purple-600" aria-hidden />
        <Avatar src={repost.user.profileImage} name={repost.user.name} size="sm" />
        <p>
          Reposted by <span className="font-semibold">{repost.user.name}</span>
        </p>
      </div>
      <div className="bg-white p-3 rounded-lg mt-2">
        <div className="flex items-center gap-2 text-gray-700">
          <Avatar src={original.user.profileImage} name={original.user.name} size="sm" />
          <div className="flex flex-col">
            <span className="font-semibold">{original.user.name}</span>
            <time className="text-xs text-gray-500" dateTime={original.createdAt}>
              {new Date(original.createdAt).toLocaleString()}
            </time>
          </div>
        </div>

        <div className="mt-2">
          <PostMedia src={original.mediaUrl} className="mt-2 rounded-lg w-full" />
          {original.content && (
            <p className="text-gray-800 whitespace-pre-line break-words">{original.content}</p>
          )}
        </div>
        <div className="mt-3 text-xs text-gray-500">
          Reposted on <time dateTime={repost.createdAt}>{new Date(repost.createdAt).toLocaleString()}</time>
        </div>
      </div>
    </article>
  );
};

export default RepostCard;
