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
    isRepost?: boolean;
  };

  const API_BASE_URL = "http://localhost:3000/api";
  const [posts, setPosts] = useState<PostType[]>([]);
  const [reposts, setReposts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    fetchReposts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsResponse = await axios.get<PostType[]>(`${API_BASE_URL}/posts/`);
      setPosts(postsResponse.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }finally{
      setLoading(false)
    }
  };

   const fetchReposts = async  () =>{
    try{
      const repostResponse = await axios.get<PostType[]>(`${API_BASE_URL}/reposts/`);
      setReposts(repostResponse.data);
    }catch (error){
      console.error("Error fetching Reposts", error)
    }finally{
      setLoading(false);
    }
   };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-12">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">Posts</h1>
      {loading ? (
        <p className="text-gray-600">Loading posts...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <p className="text-gray-600">No posts available.</p>
          )}
        </div>
      )}

      <h1 className="text-2xl font-bold text-purple-700 mt-8 mb-4">Reposts</h1>
      {loading ? (
        <p className="text-gray-600">Loading reposts...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {reposts.length > 0 ? (
            reposts.map((repost) => (
              <RepostCard key={repost.id} repost={repost} />
            ))
          ) : (
            <p className="text-gray-600">No reposts available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
