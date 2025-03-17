import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";

const Dashboard = () => {
  type PostType = {
    id: string;
    user: { name: string; profilePhoto?: string };
    content?: string;
    mediaUrl?: string;
    likes: number;
    comments: { id: string; text: string; user: string }[];
  };
  
  const [posts, setPosts] = useState<PostType[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/posts/");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:5000/api/likes/${postId}`);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/comments/${postId}`, {
        text: commentText,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, response.data] }
            : post
        )
      );
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">Posts</h1>
      {loading ? (
        <p className="text-gray-600">Loading posts...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))
          ) : (
            <p className="text-gray-600">No posts available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
