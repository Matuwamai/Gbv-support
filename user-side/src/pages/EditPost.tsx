import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { getErrorMessage } from "../lib/api";
import { isVideo, MAX_UPLOAD_BYTES } from "../lib/media";
import { useAuth } from "../context/auth";
import type { Post } from "../types";
import PostMedia from "../components/PostMedia";

export default function UpdatePostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get<Post>(`/posts/${postId}`);
        if (currentUser && data.user.id !== currentUser.id) {
          setLoadError("You can only edit your own posts.");
          return;
        }
        setContent(data.content ?? "");
        setMediaUrl(data.mediaUrl ?? null);
      } catch (err) {
        setLoadError(getErrorMessage(err, "Failed to fetch post data."));
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, currentUser]);

  // Free the temporary preview URL when it is replaced.
  useEffect(() => {
    return () => {
      if (mediaUrl?.startsWith("blob:")) URL.revokeObjectURL(mediaUrl);
    };
  }, [mediaUrl]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.size > MAX_UPLOAD_BYTES) {
      setError("File size exceeds the 10MB limit.");
      return;
    }
    setError("");
    setFile(selectedFile);
    setMediaUrl(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!content.trim() && !mediaUrl) {
      setError("Post cannot be empty.");
      return;
    }

    const formData = new FormData();
    formData.append("content", content.trim());
    if (file) {
      formData.append("mediaUrl", file);
    }

    setSaving(true);
    try {
      await api.put(`/posts/${postId}`, formData);
      setSuccess("Post updated successfully!");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update post."));
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-6 mt-12 bg-gray-100 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Update Post</h2>

        {loading ? (
          <p>Loading post...</p>
        ) : loadError ? (
          <div>
            <p className="text-red-500 font-semibold mb-4">{loadError}</p>
            <Link to="/profile" className="text-purple-700 underline">
              Back to your profile
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {file && isVideo(file) && mediaUrl ? (
              <video src={mediaUrl} controls className="w-full rounded-lg mb-2" />
            ) : file && mediaUrl ? (
              <img src={mediaUrl} alt="New attachment" className="w-full rounded-lg mb-2" />
            ) : (
              <PostMedia src={mediaUrl} />
            )}
            <div>
              <label htmlFor="edit-media" className="block font-medium text-gray-700">
                Change Media
              </label>
              <input
                id="edit-media"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="mt-1 block w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="edit-content" className="sr-only">
                Post content
              </label>
              <textarea
                id="edit-content"
                value={content}
                maxLength={5000}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 border rounded-lg"
                rows={4}
                placeholder="Edit your post content"
              />
            </div>
            {error && <p className="text-red-500 font-semibold">{error}</p>}
            {success && <p className="text-green-600 font-semibold">{success}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="w-1/3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="w-2/3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
