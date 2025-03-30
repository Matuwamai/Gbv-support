import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
import RepostCard from "../components/rePostCard";

const Dashboard = () => {
  type UserType = {
    id: string;
    name: string;
    profilePhoto?: string;
  };

  type PostType = {
    id: string | number;
    user: UserType;
    content?: string;
    mediaUrl?: string;
    likes: number;
    comments: { id: string; text: string; user: string }[];
    timestamp?: string;
    repostedBy?: string; // Added to identify reposts
    isRepost?: boolean;
  };

  const API_BASE_URL = "http://localhost:5000/api";
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsResponse = await axios.get<PostType[]>(`${API_BASE_URL}/posts/`);
      const repostsResponse = await axios.get<{ reposts: { id: string; userId: string; postId: string; createdAt: string }[] }>(
        `${API_BASE_URL}/reposts/`
      );

      const posts = postsResponse.data || [];
      const repostsData = repostsResponse.data.reposts || [];

      // Fetch the original post for each repost
      const reposts = await Promise.all(
        repostsData.map(async (repost) => {
          try {
            const originalPostResponse = await axios.get<PostType>(`${API_BASE_URL}/posts/${repost.postId}`);
            return {
              ...originalPostResponse.data,
              id: repost.id, // Keep repost ID
              repostedBy: repost.userId, // Track who reposted it
              timestamp: repost.createdAt, // Use repost timestamp
              isRepost: true,
            };
          } catch (error) {
            console.error(`Error fetching original post for repost ID ${repost.id}:`, error);
            return null;
          }
        })
      );

      // Filter out failed repost fetches
      const validReposts = reposts.filter((repost) => repost !== null);

      // Combine posts and reposts
      const combinedPosts = [...posts, ...validReposts].sort(
        (a, b) => new Date(b.timestamp || "").getTime() - new Date(a.timestamp || "").getTime()
      );

      setPosts(combinedPosts);
    } catch (error) {
      console.error("Error fetching posts and reposts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-12">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">Posts & Reposts</h1>
      {loading ? (
        <p className="text-gray-600">Loading posts...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {posts.length > 0 ? (
            posts.map((post) =>
              post.isRepost ? (
                <RepostCard key={post.id} post={post} />
              ) : (
                <PostCard key={post.id} post={post} />
              )
            )
          ) : (
            <p className="text-gray-600">No posts available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
