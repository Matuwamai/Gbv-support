import prisma from "../lib/prisma.js";
import { withUserImage } from "../lib/media.js";
import { canModify } from "../lib/auth.js";

const MAX_COMMENT_LENGTH = 2000;

const userSelect = { select: { id: true, name: true, profileImage: true } };
const withCommentUser = (comment) => ({ ...comment, user: withUserImage(comment.user) });

const validateContent = (content) => {
  const text = typeof content === "string" ? content.trim() : "";
  if (!text) return { error: "Comment cannot be empty" };
  if (text.length > MAX_COMMENT_LENGTH) {
    return { error: `Comment must be at most ${MAX_COMMENT_LENGTH} characters` };
  }
  return { text };
};

export const createComment = async (req, res) => {
  try {
    const postId = parseInt(req.body.postId, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid or missing postId" });
    }
    const { text, error } = validateContent(req.body.content);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let parentId = null;
    if (req.body.parentId !== undefined && req.body.parentId !== null) {
      parentId = parseInt(req.body.parentId, 10);
      const parent = isNaN(parentId)
        ? null
        : await prisma.comment.findUnique({ where: { id: parentId } });
      if (!parent || parent.postId !== postId) {
        return res.status(400).json({ message: "Invalid parent comment" });
      }
    }

    const comment = await prisma.comment.create({
      data: { content: text, userId: req.user.id, postId, parentId },
      include: { user: userSelect },
    });

    return res
      .status(201)
      .json({ message: "Comment added successfully", comment: withCommentUser(comment) });
  } catch (error) {
    console.error("Create Comment Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCommentsForPost = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { user: userSelect },
      orderBy: { createdAt: "asc" },
    });

    return res.status(200).json(comments.map(withCommentUser));
  } catch (error) {
    console.error("Get Comments Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCommentById = async (req, res) => {
  try {
    const id = parseInt(req.params.commentId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { user: userSelect },
    });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json(withCommentUser(comment));
  } catch (error) {
    console.error("Get Comment Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateComment = async (req, res) => {
  try {
    const id = parseInt(req.params.commentId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    const { text, error } = validateContent(req.body.content);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const existingComment = await prisma.comment.findUnique({ where: { id } });
    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (!canModify(req.user, existingComment.userId)) {
      return res.status(403).json({ message: "You can only edit your own comments" });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content: text },
      include: { user: userSelect },
    });

    return res.status(200).json({
      message: "Comment updated successfully",
      updatedComment: withCommentUser(updatedComment),
    });
  } catch (error) {
    console.error("Update Comment Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const id = parseInt(req.params.commentId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    const existingComment = await prisma.comment.findUnique({ where: { id } });
    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (!canModify(req.user, existingComment.userId)) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    // Reactions on the comment would otherwise be orphaned; replies keep their place.
    await prisma.$transaction([
      prisma.likeDislike.deleteMany({ where: { commentId: id } }),
      prisma.comment.delete({ where: { id } }),
    ]);

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
