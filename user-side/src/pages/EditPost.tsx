import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000/api";

export default function UpdatePostPage() {
  const [post, setPost] = useState({ content: "", mediaUrl: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPost() {
      if (!postId) {
        setError("Invalid post ID");
        setLoading(false);
        return;
      }
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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPost({ ...post, mediaUrl: URL.createObjectURL(selectedFile) });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append("content", post.content || ""); 
  
    if (file) {
      formData.append("mediaUrl", file); 
    }
  
    try {
      const response = await axios.put(`${API_BASE_URL}/posts/${postId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("Update Response:", response.data);
      setSuccess("Post updated successfully!");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (error) {
      console.error("Update Error:", error.response ? error.response.data : error.message);
      setError("Failed to update post.");
    }
  };
  
  
  
  return (
    <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Update Post</h2>

        {loading && <p>Loading post...</p>}
        

        <form onSubmit={handleSubmit} className="space-y-4">
          {post.mediaUrl && (
            post.mediaUrl.endsWith(".mp4") ? (
              <video controls className="w-full rounded-lg mb-2">
                <source src={post.mediaUrl} type="video/mp4" />
              </video>
            ) : (
              <img src={post.mediaUrl} alt="Post" className="w-full rounded-lg mb-2" />
            )
          )}
          <div>
            <label className="block font-medium text-gray-700">Change Media</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="mt-1 block w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <textarea
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              className="w-full p-4 border rounded-lg"
              rows={4}
              placeholder="Edit your post content"
            />
          </div>
          {error && <p className="text-red-500 font-semibold">{error}</p>}
          { success && <p className="text-green-500 font-semibold">{success}</p>}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
