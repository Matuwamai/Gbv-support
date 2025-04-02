import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import PostCard from "../components/PostCard";
import RepostCard from "../components/rePostCard";

const API_BASE_URL = "http://localhost:3000/api";

export default function UserPostsPage() {
  const [posts, setPosts] = useState([]);
  const [reposts, setReposts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      fetchPostsAndReposts(parsedUser.id);
    }
  }, []);

  const fetchPostsAndReposts = async (userId: number) => {
    try {
      const postsResponse = await axios.get(`${API_BASE_URL}/posts/user/${userId}`);
      // const repostsResponse = await axios.get(`${API_BASE_URL}/posts/reposts/${userId}`);
      
      setPosts(postsResponse.data);
      // setReposts(repostsResponse.data);
    } catch (error) {
      setError("Error fetching posts and reposts.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/posts/${postId}`);
      setSuccessMessage("Post deleted successfully!");
      // Remove deleted post from the state
      setPosts(posts.filter(post => post.id !== postId));
      setReposts(reposts.filter(repost => repost.id !== postId));
    } catch (error) {
      setError("Failed to delete post.");
    }
  };

  const handleUpdate = (postId: number) => {
    navigate(`/update-post/${postId}`); // Redirect to update page for editing
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Your Posts & Reposts</h2>

        {loading && <p>Loading posts...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        {/* Display User's Posts */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Your Posts</h3>
          {posts.map(post => (
            <div key={post.id} className="mb-6">
              <PostCard post={post} />
              <div className="flex space-x-4 mt-2">
                <button
                  onClick={() => handleUpdate(post.id)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Display User's Reposts */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Reposts</h3>
          {reposts.map(repost => (
            <div key={repost.id} className="mb-6">
              <RepostCard repost={repost} />
              <div className="flex space-x-4 mt-2">
                <button
                  onClick={() => handleUpdate(repost.id)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(repost.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && reposts.length === 0 && !loading && <p>You have no posts or reposts yet.</p>}
      </div>
    </div>
  );
}
