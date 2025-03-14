const PostCard = ({ post }) => {
  if (!post) return <p>Post not found</p>;

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
        <button className="hover:text-blue-500">Like</button>
        <button className="hover:text-blue-500">Comment</button>
        <button className="hover:text-blue-500">Share</button>
      </div>

      {/* Comments Section */}
      {post.comments?.length > 0 && (
        <div className="mt-4 border-t pt-2">
          <h3 className="text-sm font-semibold text-gray-700">Comments</h3>
          {post.comments.slice(0, 2).map((comment, index) => (
            <div key={index} className="flex items-start mt-2">
              <img
                src={comment.user.profilePhoto || "/default-profile.png"}
                alt={comment.user.name}
                className="w-8 h-8 rounded-full mr-2"
              />
              <div className="bg-gray-100 p-2 rounded-lg w-full">
                <p className="text-xs font-semibold text-gray-800">{comment.user.name}</p>
                <p className="text-xs text-gray-700">{comment.text}</p>
              </div>
            </div>
          ))}
          {post.comments.length > 2 && (
            <button className="text-blue-500 text-sm mt-2">Read More Comments</button>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
