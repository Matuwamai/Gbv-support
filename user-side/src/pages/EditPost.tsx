import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate} from "react-router-dom";

const API_BASE_URL = "http://localhost:3000/api";

export default function UpdatePostPage() {
  const [post, setPost] = useState({ content: "", media: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { postId } = useParams(); // Get post ID from URL
  const naigate = useNavigate();

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await axios.get(`${API_BASE_URL}/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        setError("Failed to fetch post data.");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [postId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await axios.put(`${API_BASE_URL}/posts/${postId}`, { content: post.content });
      naigate("/user-posts"); 
    } catch (error) {
      setError("Failed to update post.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Update Post</h2>

        {loading && <p>Loading post...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              className="w-full p-4 border rounded-lg"
              rows={4}
              placeholder="Edit your post content"
            />
          </div>

          <button type="submit" className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
