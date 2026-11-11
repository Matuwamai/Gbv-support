import { useCallback, useEffect, useState } from "react";
import api, { getErrorMessage } from "../lib/api";
import type { Post, Repost } from "../types";
import PostCard from "../components/PostCard";
import RepostCard from "../components/rePostCard";
import PostCreation from "../components/Createpost";

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [reposts, setReposts] = useState<Repost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFeed = useCallback(async () => {
    try {
      const [postsResponse, repostsResponse] = await Promise.all([
        api.get<Post[]>("/posts"),
        api.get<Repost[]>("/reposts"),
      ]);
      setPosts(postsResponse.data);
      setReposts(repostsResponse.data);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "Could not load posts."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return (
    <div id="create-post" className="max-w-4xl mx-auto p-4 mt-12 bg-gray-200 min-h-screen">
      <h1 className="text-2xl font-bold text-purple-700 mb-4 text-center">Create a post</h1>
      <PostCreation onCreated={fetchFeed} />

      {error && (
        <div className="text-center mb-4">
          <p className="text-red-600">{error}</p>
          <button onClick={fetchFeed} className="mt-2 text-purple-700 underline">
            Try again
          </button>
        </div>
      )}

      <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">Posts</h2>
      {loading ? (
        <p className="text-gray-600 text-center">Loading posts...</p>
      ) : (
        <div className="flex flex-col gap-4 items-center">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} onReposted={fetchFeed} />)
          ) : (
            <p className="text-gray-600">No posts yet. Be the first to share.</p>
          )}
        </div>
      )}

      <h2 className="text-2xl font-bold text-purple-700 mt-8 mb-4 text-center">Reposts</h2>
      {loading ? (
        <p className="text-gray-600 text-center">Loading reposts...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reposts.length > 0 ? (
            reposts.map((repost) => <RepostCard key={repost.id} repost={repost} />)
          ) : (
            <p className="text-gray-600 text-center">No reposts yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
