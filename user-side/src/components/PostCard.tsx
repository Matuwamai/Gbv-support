import { useCallback, useEffect, useState, FormEvent } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import { BiRepost } from "react-icons/bi";
import api, { getErrorMessage } from "../lib/api";
import { useAuth } from "../context/auth";
import type { Comment, Post, ReactionSummary } from "../types";
import Avatar from "./Avatar";
import PostMedia from "./PostMedia";

interface PostCardProps {
  post: Post;
  /** Called after the current user reposts this post. */
  onReposted?: () => void;
}

const COMMENTS_PREVIEW = 2;

const PostCard = ({ post, onReposted }: PostCardProps) => {
  const { currentUser } = useAuth();
  const isOwnPost = currentUser?.id === post.user?.id;

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [reposts, setReposts] = useState(post._count?.reposts ?? 0);
  const [reposted, setReposted] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const applyReactions = (summary: ReactionSummary) => {
    setLikes(summary.likes);
    setLiked(summary.userReaction === "LIKE");
  };

  const loadPostData = useCallback(async () => {
    const [reactionRes, repostRes, commentRes] = await Promise.allSettled([
      api.get<ReactionSummary>(`/likes/${post.id}`),
      api.get<{ reposts: number; reposted: boolean }>(`/reposts/post/${post.id}`),
      api.get<Comment[]>(`/comments/${post.id}`),
    ]);
    if (reactionRes.status === "fulfilled") applyReactions(reactionRes.value.data);
    if (repostRes.status === "fulfilled") {
      setReposts(repostRes.value.data.reposts);
      setReposted(repostRes.value.data.reposted);
    }
    if (commentRes.status === "fulfilled") setComments(commentRes.value.data);
  }, [post.id]);

  useEffect(() => {
    loadPostData();
  }, [loadPostData]);

  const handleLike = async () => {
    // Optimistic update; the server response then sets the real numbers.
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes((prev) => prev + (wasLiked ? -1 : 1));
    try {
      const { data } = await api.post<ReactionSummary>("/likes", { postId: post.id, reaction: "LIKE" });
      applyReactions(data);
    } catch (error) {
      setLiked(wasLiked);
      setLikes((prev) => prev + (wasLiked ? 1 : -1));
      setNotice({ type: "error", text: getErrorMessage(error, "Could not update your like.") });
    }
  };

  const handleComment = async (event: FormEvent) => {
    event.preventDefault();
    const content = newComment.trim();
    if (!content || busy) return;

    setBusy(true);
    try {
      const { data } = await api.post<{ comment: Comment }>("/comments", { content, postId: post.id });
      setComments((prev) => [...prev, data.comment]);
      setNewComment("");
      setShowAllComments(true);
    } catch (error) {
      setNotice({ type: "error", text: getErrorMessage(error, "Could not post your comment.") });
    } finally {
      setBusy(false);
    }
  };

  const handleRepost = async () => {
    if (isOwnPost || reposted || busy) return;
    setBusy(true);
    try {
      const { data } = await api.post<{ reposts: number }>("/reposts", { postId: post.id });
      setReposts(data.reposts);
      setReposted(true);
      setNotice({ type: "success", text: "Reposted." });
      onReposted?.();
    } catch (error) {
      setNotice({ type: "error", text: getErrorMessage(error, "Could not repost.") });
    } finally {
      setBusy(false);
    }
  };

  const handleReport = async () => {
    if (!window.confirm("Report this post to the moderators?")) return;
    try {
      await api.post("/cases", { postId: post.id });
      setNotice({ type: "success", text: "Thank you. The moderators will review this post." });
    } catch (error) {
      setNotice({ type: "error", text: getErrorMessage(error, "Could not report this post.") });
    }
  };

  const visibleComments = showAllComments ? comments : comments.slice(0, COMMENTS_PREVIEW);

  return (
    <article className="bg-white shadow-lg rounded-lg p-4 mb-4 w-full border border-gray-300">
      <header className="flex items-center mb-2 gap-3">
        <Avatar src={post.user?.profileImage} name={post.user?.name} />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{post.user?.name}</span>
          <time className="text-xs text-gray-500" dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleString()}
          </time>
        </div>
      </header>

      <PostMedia src={post.mediaUrl} />
      {post.content && <p className="text-gray-700 mb-2 whitespace-pre-line break-words">{post.content}</p>}

      <div className="flex justify-between text-sm text-gray-500 border-t pt-2">
        <span>
          {likes} {likes === 1 ? "Like" : "Likes"}
        </span>
        <span>
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </span>
        <span>
          {reposts} {reposts === 1 ? "Repost" : "Reposts"}
        </span>
      </div>

      <div className="flex justify-around text-purple-600 mt-2 border-t pt-2">
        <button
          onClick={handleLike}
          className={liked ? "text-blue-500" : "hover:text-blue-500"}
          aria-pressed={liked}
          aria-label={liked ? "Unlike" : "Like"}
          title={liked ? "Unlike" : "Like"}
        >
          {liked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
        </button>
        <button
          onClick={() => setShowCommentInput((show) => !show)}
          className="hover:text-blue-500"
          aria-label="Comment"
          title="Comment"
        >
          <ModeCommentIcon />
        </button>
        <button
          onClick={handleRepost}
          disabled={isOwnPost || reposted || busy}
          className={`text-2xl disabled:cursor-not-allowed ${reposted ? "text-blue-500" : "hover:text-blue-500 disabled:opacity-40"}`}
          aria-label="Repost"
          title={isOwnPost ? "You can't repost your own post" : reposted ? "Already reposted" : "Repost"}
        >
          <BiRepost />
        </button>
        {!isOwnPost && (
          <button onClick={handleReport} className="hover:text-red-500" aria-label="Report post" title="Report post">
            <FlagOutlinedIcon />
          </button>
        )}
      </div>

      {notice && (
        <p className={`mt-2 text-sm ${notice.type === "error" ? "text-red-500" : "text-green-600"}`} role="status">
          {notice.text}
        </p>
      )}

      {showCommentInput && (
        <form onSubmit={handleComment} className="mt-2 flex">
          <input
            type="text"
            className="border p-2 w-full rounded-sm"
            placeholder="Write a comment..."
            value={newComment}
            maxLength={2000}
            onChange={(e) => setNewComment(e.target.value)}
            aria-label="Write a comment"
          />
          <button
            type="submit"
            disabled={busy || !newComment.trim()}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-sm disabled:opacity-50"
          >
            Post
          </button>
        </form>
      )}

      {comments.length > 0 && (
        <section className="mt-4 border-t pt-2 max-h-60 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-700">Comments ({comments.length})</h3>
          {visibleComments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2 mt-2">
              <Avatar src={comment.user?.profileImage} name={comment.user?.name} size="sm" />
              <div className="bg-gray-100 p-2 rounded-lg w-full">
                <p className="text-xs font-semibold text-gray-800">{comment.user?.name}</p>
                <p className="text-xs text-gray-700 whitespace-pre-line break-words">{comment.content}</p>
              </div>
            </div>
          ))}
          {comments.length > COMMENTS_PREVIEW && (
            <button onClick={() => setShowAllComments((show) => !show)} className="text-blue-500 text-sm mt-2">
              {showAllComments ? "Show fewer comments" : `Read all ${comments.length} comments`}
            </button>
          )}
        </section>
      )}
    </article>
  );
};

export default PostCard;
