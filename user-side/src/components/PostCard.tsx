import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PostCard = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${postId}`);
        if (!response.ok) throw new Error("Failed to fetch post");
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) return <p>Loading post...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4 w-full max-w-xl border border-gray-200">
      {/* User Info */}
      <div className="flex items-center mb-2">
        <img
          src={post.user.profilePhoto || "/default-profile.png"}
          alt={post.user.name}
          className="w-10 h-10 rounded-full mr-3"
        />
        <span className="font-semibold text-gray-800">{post.user.name}</span>
      </div>

      {/* Post Content */}
      {post.content && <p className="text-gray-700 mb-2">{post.content}</p>}
      {post.image && <img src={post.image} alt="Post" className="w-full rounded-lg mb-2" />}
      {post.video && (
        <video controls className="w-full rounded-lg mb-2">
          <source src={post.video} type="video/mp4" />
        </video>
      )}

      {/* Actions */}
      <div className="flex justify-around text-gray-600 mt-2"> 
        <button className="hover:text-blue-500">Like</button>
        <button className="hover:text-blue-500">Comment</button>
        <button className="hover:text-blue-500">Share</button>
      </div>
    </div>
  );
};

export default PostCard;
