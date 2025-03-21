import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import { BiRepost } from "react-icons/bi";
import { Authcontext } from "../context/authContext";

interface User {
  id: string;
  profileImage?: string;
  name?: string;
}

interface Post {
  id: string |number;
  text?: string;
  user?: User;
  content?: string;
  mediaUrl?: string;
  timestamp?: string;
  likes?: number;
}

interface CommentType {
  id: number;
  text: string;
  user?: User;
  content?: string;
}

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  
  if (!post) return <p>Post not found</p>;
  const authContext = useContext(Authcontext);
  const currentUser = authContext?.currentUser;

  console.log("Current User Object:", currentUser);

  const [likes, setLikes] = useState<number>(post.likes || 0);
  const [liked, setLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [reposts, setReposts] = useState<number>(0);
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);
  const [showAllComments, setShowAllComments] = useState<boolean>(false);
  const [reposted, setReposted] = useState<boolean>(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleLike = async () => {
    if (!currentUser) {
      console.error("User not logged in");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/likes/`, {
        userId: currentUser.id,
        postId: post.id,
        reaction: "LIKE",
      });

      setLikes(response.data.likes);
      setLiked(true);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleRepost = async () => {
    if (!currentUser) {
      console.error("User not logged in");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/reposts/`, {
        userId: currentUser.id,
        postId: post.id,
      });

      setReposted(true);
    } catch (error) {
      console.error("Error reposting post:", error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/comments`, {
        content: newComment,
        userId: currentUser?.id,
        postId: post.id,
      });
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  useEffect(() => {
    fetchLikes();
    fetchReposts();
  }, []);

  const fetchLikes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/likes/${post.id}`);
      setLikes(response.data.likes);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/comments/${post.id}`);
        setComments(response.data || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    };
    fetchComments();
  }, [post.id]);

  const fetchReposts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reposts/post/${post.id}`);
      setReposts(response.data.reposts);
    } catch (error) {
      console.error("Error fetching reposts:", error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4 w-full max-w-xl border border-gray-300">
      <div className="flex items-center mb-2">
        <img
          src={post.user?.profileImage || "/default-profile.png"}
          alt={post.user?.name || "User"}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <span className="font-semibold text-gray-800">{post.user?.name}</span>
          <p className="text-sm text-gray-500">{post.timestamp}</p>
        </div>
      </div>
      {post.mediaUrl && (
        post.mediaUrl.endsWith(".mp4") ? (
          <video controls className="w-full rounded-lg mb-2">
            <source src={post.mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <img src={post.mediaUrl} alt="Post" className="w-full rounded-lg mb-2" />
        )
      )}
      {post.content && <p className="text-gray-700 mb-2">{post.content}</p>}
      <div className="flex justify-between text-sm text-gray-500 border-t pt-2">
        <span>{likes} Likes</span>
        <span>{comments.length} Comments</span>
        <span>{reposts} Reposts</span>
      </div>
      <div className="flex justify-around text-purple-600 mt-2 border-t pt-2">
        <button onClick={handleLike} className={liked ? "text-blue-500" : "hover:text-blue-500"}><ThumbUpIcon /></button>
        <button onClick={() => setShowCommentInput(!showCommentInput)} className="hover:text-blue-500"><ModeCommentIcon /></button>
        <button onClick={handleRepost} className={reposted ? "text-blue-500" : "hover:text-blue-500"}><BiRepost /></button>
      </div>
      {showCommentInput && (
        <div className="mt-2 flex">
          <input type="text" className="border p-2 w-full rounded-sm" placeholder="Write a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
          <button onClick={handleComment} className="ml-2 px-4 py-2 bg-blue-500 text-white">Post</button>
        </div>
      )}
      <div className="mt-4 border-t pt-2 max-h-40 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-700">Comments ({comments.length})</h3>
        {(showAllComments ? comments : comments.slice(0, 2)).map((comment, index) => (
          <div key={index} className="flex items-start mt-2">
            <img
              src={comment.user?.profileImage || "/default-profile.png"}
              alt={comment.user?.name || "User"}
              className="w-8 h-8 rounded-full"
            />
            <div className="bg-gray-100 p-2 rounded-lg w-full">
              <p className="text-xs font-semibold text-gray-800">{comment.user?.name}</p>
              <p className="text-xs text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}
        {comments.length > 2 && !showAllComments && (
          <button
            onClick={() => setShowAllComments(true)}
            className="text-blue-500 text-sm mt-2">
            Read More Comments
          </button>
        )}
      </div>
    </div>
    
  );
};

export default PostCard;
