import { useState, useEffect } from "react";
import axios from "axios";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import { BiRepost } from "react-icons/bi";

const PostCard = ({ post }) => {
  if (!post) return <p>Post not found</p>;

  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<{ id: number; text: string }[]>([]);
  const [newComment, setNewComment] = useState("");
  const [reposts, setReposts] = useState(0);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  // Handle Like
  const handleLike = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/likes/`, {
        userId: currentUser.id,  // Replace with actual logged-in user ID
        postId: post.id,         // Replace with the actual post ID
        reaction: "LIKE",
      });
  
      setLikes(response.data.likes); // Assuming API returns updated like count
      setLiked(true);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  

  // Handle Comment Posting
  const handleComment = async () => {
    if (!newComment.trim()) return;

    const commentData = {
      content: newComment,
      userId: post.user?.id,
      postId: post.id,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/comments", commentData);
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  useEffect(() => {
    fetchLikes();
    // fetchComments();
    fetchReposts();
  }, []);

  const fetchLikes = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/likes/${post.id}`);
      setLikes(response.data.likes);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/comments/${post.id} `);
        setComments(response.data || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]); // Set fallback value
      }
    };
  
    fetchComments();
  }, [post.id]);
  

  const fetchReposts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/apii/reposts/post/${post.id}`);
      setReposts(response.data.reposts);
    } catch (error) {
      console.error("Error fetching reposts:", error);
    }
  };
  console.log("Comments state:", comments);


  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4 w-full max-w-xl border border-gray-300">
      {/* Post Owner */}
      <div className="flex items-center mb-2">
        <img
          src={post.user?.profilePhoto || "/default-profile.png"}
          alt={post.user?.name || "User"}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <span className="font-semibold text-gray-800">{post.user?.name}</span>
          <p className="text-sm text-gray-500">{post.timestamp}</p>
        </div>
      </div>

      {/* Post Media */}
      {post.video ? (
        <video controls className="w-full rounded-lg mb-2">
          <source src={post.video} type="video/mp4" />
        </video>
      ) : post.image ? (
        <img src={post.image} alt="Post" className="w-full rounded-lg mb-2" />
      ) : null}

      {/* Post Content */}
      {post.content && <p className="text-gray-700 mb-2">{post.content}</p>}

      {/* Post Stats */}
      <div className="flex justify-between text-sm text-gray-500 border-t pt-2">
        <span>{likes} Likes</span>
        {comments && Array.isArray(comments) ? (
          <span>{comments.length} Comments</span>
        ) : (
          <span>0 Comments</span>
        )}

        <span>{reposts} Reposts</span>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around text-purple-600 mt-2 border-t pt-2">
        <button onClick={handleLike} className={`hover:text-blue-500 ${liked && "text-blue-500"}`}>
          <ThumbUpIcon />
        </button>
        <button onClick={() => setShowCommentInput(!showCommentInput)} className="hover:text-blue-500">
          <ModeCommentIcon />
        </button>
        <button className="hover:text-blue-500">
          <BiRepost />
        </button>
      </div>

      {/* Comment Input Field */}
      {showCommentInput && (
        <div className="mt-2 flex">
          <input
            type="text"
            className="border border-gray-300 rounded-lg p-2 w-full text-sm"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleComment} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
            Post
          </button>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-4 border-t pt-2 max-h-40 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-700">Comments ({comments.length})</h3>
        {(showAllComments ? comments : comments.slice(0, 2)).map((comment, index) => (
          <div key={index} className="flex items-start mt-2">
            <img
              src={comment.user?.profilePhoto || "/default-profile.png"}
              alt={comment.user?.name}
              className="w-8 h-8 rounded-full mr-2"
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
