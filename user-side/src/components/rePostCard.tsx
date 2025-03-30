import React from "react";
import PostCard from "./PostCard"; // Import the original PostCard component
import { User } from "lucide-react";

type UserType = {
  id: string;
  name: string;
  profilePhoto?: string;
};

type PostType = {
  id: string;
  user: UserType;
  content?: string;
  mediaUrl?: string;
  likes: number;
  comments: { id: string; text: string; user: string }[];
  timestamp?: string;
  repostedBy?: UserType; // Ensure this is a full UserType object, not just an ID.
  isRepost?: boolean;
};

const RepostCard: React.FC<{ post: PostType }> = ({ post }) => {
  if (!post.repostedBy) {
    return null; // If repostedBy is missing, don't render
  }
  console.log(User)

  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-100">
      {/* Reposted by section */}
      <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
        {post.repostedBy.profilePhoto ? (
          <img
            src={post.repostedBy.profilePhoto}
            alt={post.repostedBy.name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            📷
          </div> // Placeholder image if no profile photo
        )}
        <p>
          Reposted by <span className="font-semibold">{post.repostedBy.name}</span>
        </p>
      </div>

      {/* Render the original PostCard inside */}
      <div className="   bg-white">
        <PostCard post={post} />
      </div>
    </div>
  );
};

export default RepostCard;
