import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../lib/api";
import { useAuth } from "../context/auth";
import type { Post, Repost } from "../types";
import PostCard from "../components/PostCard";
import RepostCard from "../components/rePostCard";

export default function UserPostsPage() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [reposts, setReposts] = useState<Repost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const userId = currentUser?.id;

  const fetchPostsAndReposts = useCallback(async () => {
    if (!userId) return;
    try {
      const [postsResponse, repostsResponse] = await Promise.all([
        api.get<Post[]>(`/posts/user/${userId}`),
        api.get<Repost[]>(`/reposts/user/${userId}`),
      ]);
      setPosts(postsResponse.data);
      setReposts(repostsResponse.data);
    } catch (err) {
      setError(getErrorMessage(err, "Error fetching posts and reposts."));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPostsAndReposts();
  }, [fetchPostsAndReposts]);

  const showResult = (message: string, isError = false) => {
    setError(isError ? message : "");
    setSuccessMessage(isError ? "" : message);
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm("Delete this post? This also removes its comments and reposts.")) return;
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      showResult("Post deleted successfully!");
    } catch (err) {
      showResult(getErrorMessage(err, "Failed to delete post."), true);
    }
  };

  // Removing a repost must call the reposts endpoint: the repost id is not a post id.
  const handleRemoveRepost = async (repostId: number) => {
    if (!window.confirm("Remove this repost?")) return;
    try {
      await api.delete(`/reposts/${repostId}`);
      setReposts((prev) => prev.filter((repost) => repost.id !== repostId));
      showResult("Repost removed.");
    } catch (err) {
      showResult(getErrorMessage(err, "Failed to remove repost."), true);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Your Posts & Reposts</h2>

        {loading && <p>Loading posts...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Your Posts</h3>
          {!loading && posts.length === 0 && <p className="text-gray-600">You haven't posted anything yet.</p>}
          {posts.map((post) => (
            <div key={post.id} className="mb-6">
              <PostCard post={post} />
              <div className="flex gap-4 mt-2 items-center justify-center">
                <button
                  onClick={() => navigate(`/update-post/${post.id}`)}
                  className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4">Your Reposts</h3>
          {!loading && reposts.length === 0 && <p className="text-gray-600">You haven't reposted anything yet.</p>}
          {reposts.map((repost) => (
            <div key={repost.id} className="mb-6">
              <RepostCard repost={repost} />
              <div className="flex mt-2 justify-center">
                <button
                  onClick={() => handleRemoveRepost(repost.id)}
                  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-sm"
                >
                  Remove repost
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
