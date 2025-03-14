import { useState,  } from "react";
import axios from "axios";
// import { AuthContext } from "./AuthContextt"; // Assuming you have Auth Context

const PostCard = ({ post }) => {
  if (!post) return <p>Post not found</p>;

  // const { user } = useContext(AuthContext); // Get logged-in user
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");

  // Handle Like
  const handleLike = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/posts/likes/`);
      setLikes(response.data.likes);
      setLiked(true);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Handle Comment
  const handleComment = async () => {
    if (!newComment.trim()) return;
    if (!user) return alert("You must be logged in to comment");

    const commentData = {
      content: newComment,
      userId: user.id, // Get logged-in user ID
      postId: post.id, // Get the specific post ID
    };

    try {
      const response = await axios.post("http://localhost:5000/api/comments", commentData);
      setComments([...comments, response.data]); // Add the new comment
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4 w-full max-w-xl border border-gray-300">
      {/* User Info */}
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

      {/* Actions */}
      <div className="flex justify-around text-gray-600 mt-2 border-t pt-2">
        <button onClick={handleLike} className={`hover:text-blue-500 ${liked && "text-blue-500"}`}>
          Like ({likes})
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-4 border-t pt-2">
        <h3 className="text-sm font-semibold text-gray-700">Comments ({comments.length})</h3>
        {comments.slice(0, 2).map((comment, index) => (
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
        {comments.length > 2 && (
          <button className="text-blue-500 text-sm mt-2">Read More Comments</button>
        )}
      </div>

      {/* Add Comment */}
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
    </div>
  );
};

export default PostCard;
