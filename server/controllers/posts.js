import prisma from "../lib/prisma.js";
import { withPostMedia } from "../lib/media.js";
import { toUploadPath, removeUpload } from "../lib/upload.js";
import { canModify } from "../lib/auth.js";

const MAX_CONTENT_LENGTH = 191; // Post.content is a VARCHAR(191) column.

const postInclude = {
  user: { select: { id: true, name: true, profileImage: true } },
  _count: { select: { comments: true, reposts: true } },
};

const validateContent = (content, hasMedia) => {
  const text = typeof content === "string" ? content.trim() : "";
  if (!text && !hasMedia) return { error: "Post must have text or media" };
  if (text.length > MAX_CONTENT_LENGTH) {
    return { error: `Post text must be at most ${MAX_CONTENT_LENGTH} characters` };
  }
  return { text };
};

export const createPost = async (req, res) => {
  const mediaUrl = toUploadPath(req.file);
  try {
    const { text, error } = validateContent(req.body.content, Boolean(mediaUrl));
    if (error) {
      await removeUpload(mediaUrl);
      return res.status(400).json({ message: error });
    }

    const post = await prisma.post.create({
      data: { content: text, userId: req.user.id, mediaUrl },
      include: postInclude,
    });

    return res.status(201).json({ message: "Post created successfully", post: withPostMedia(post) });
  } catch (error) {
    await removeUpload(mediaUrl);
    console.error("Create Post Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: postInclude,
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(posts.map(withPostMedia));
  } catch (error) {
    console.error("Get Posts Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getPostsByUser = async (req, res) => {
  try {
    const id = parseInt(req.params.userId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const posts = await prisma.post.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      include: postInclude,
    });

    return res.status(200).json(posts.map(withPostMedia));
  } catch (error) {
    console.error("Get User Posts Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const id = parseInt(req.params.postId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await prisma.post.findUnique({ where: { id }, include: postInclude });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(withPostMedia(post));
  } catch (error) {
    console.error("Get Post Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updatePost = async (req, res) => {
  const newMediaUrl = toUploadPath(req.file);
  try {
    const id = parseInt(req.params.postId, 10);
    if (isNaN(id)) {
      await removeUpload(newMediaUrl);
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      await removeUpload(newMediaUrl);
      return res.status(404).json({ message: "Post not found" });
    }
    if (!canModify(req.user, existingPost.userId)) {
      await removeUpload(newMediaUrl);
      return res.status(403).json({ message: "You can only edit your own posts" });
    }

    const mediaUrl = newMediaUrl || existingPost.mediaUrl;
    const content = req.body.content ?? existingPost.content;
    const { text, error } = validateContent(content, Boolean(mediaUrl));
    if (error) {
      await removeUpload(newMediaUrl);
      return res.status(400).json({ message: error });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { content: text, mediaUrl },
      include: postInclude,
    });

    if (newMediaUrl && existingPost.mediaUrl) {
      await removeUpload(existingPost.mediaUrl);
    }

    return res
      .status(200)
      .json({ message: "Post updated successfully", post: withPostMedia(updatedPost) });
  } catch (error) {
    await removeUpload(newMediaUrl);
    console.error("Update Post Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = parseInt(req.params.postId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!canModify(req.user, existingPost.userId)) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    // Delete related records first, atomically, so a failure can't leave orphans.
    await prisma.$transaction([
      prisma.likeDislike.deleteMany({
        where: { OR: [{ postId: id }, { comment: { postId: id } }] },
      }),
      prisma.comment.updateMany({ where: { postId: id }, data: { parentId: null } }),
      prisma.comment.deleteMany({ where: { postId: id } }),
      prisma.repost.deleteMany({ where: { postId: id } }),
      prisma.case.deleteMany({ where: { postId: id } }),
      prisma.post.delete({ where: { id } }),
    ]);
    await removeUpload(existingPost.mediaUrl);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete Post Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
