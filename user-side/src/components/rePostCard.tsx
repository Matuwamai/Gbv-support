import React from "react";
import { User } from "lucide-react";

type UserType = {
  id: string;
  name: string;
  profileImage?: string;
};

type PostType = {
  id: number;
  user: UserType; 
  content?: string;
  mediaUrl?: string;
  createdAt: string;
};

type RepostType = {
  id: number;
  user: UserType; 
  post: PostType; 
  createdAt: string;
};

const RepostCard: React.FC<{ repost: RepostType }> = ({ repost }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-100">
      {/* Reposted by section */}
      <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
        {repost.user.profileImage ? (
          <img
            src={repost.user.profileImage}
            alt={repost.user.name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <User size={20} />
          </div>
        )}
        <p>
          Reposted by <span className="font-semibold">{repost.user.name}</span>
        </p>
      </div>
      <div className="bg-white p-3 rounded-lg mt-4">
        <div className="flex items-center gap-2 text-gray-700">
          {repost.post.user.profileImage ? (
            <img
              src={repost.post.user.profileImage}
              alt={repost.post.user.name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <User size={20} />
            </div>
          )}
          <p className="font-semibold">{repost.post.user.name}</p>
        </div>

        <div className="mt-2">
          {repost.post.mediaUrl && (
            <img
              src={repost.post.mediaUrl}
              alt="Post media"
              className="mt-2 rounded-lg w-full"
            />
          )}
          <p className="text-gray-800">{repost.post.content}</p>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          Reposted on: {new Date(repost.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default RepostCard;
