import prisma from "../lib/prisma.js";
import { withPostMedia } from "../lib/media.js";
import { toUploadPath, removeUpload } from "../lib/upload.js";

export const createPost = async (req, res) => {
  try {
    const { content, userId } = req.body;

    if (!userId || isNaN(parseInt(userId, 10))) {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }

    const numericUserId = parseInt(userId, 10);

    const user = await prisma.user.findUnique({ where: { id: numericUserId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const mediaUrl = toUploadPath(req.file);

    const post = await prisma.post.create({
      data: { content, userId: numericUserId, mediaUrl: mediaUrl },
    });

    return res.status(201).json({ message: "Post created successfully", post: withPostMedia(post) });
  } catch (error) {
    console.error("Create Post Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: { select: { id: true, name: true, profileImage: true } },
      },
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
    const { userId } = req.params;
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const posts = await prisma.post.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, profileImage: true },
        },
      },
    });

    return res.status(200).json(posts.map(withPostMedia));
  } catch (error) {
    console.error("Get User Posts Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const id = parseInt(postId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, profileImage: true }
        }
      },
    });

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
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const existingPost = await prisma.post.findUnique({ where: { id: parseInt(postId, 10) } });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const mediaUrl = req.file ? toUploadPath(req.file) : existingPost.mediaUrl;

    const updatedPost = await prisma.post.update({
      where: { id: parseInt(postId, 10) },
      data: { content, mediaUrl },
    });

    if (req.file && existingPost.mediaUrl) {
      await removeUpload(existingPost.mediaUrl);
    }

    return res.status(200).json({ message: "Post updated successfully", post: withPostMedia(updatedPost) });
  } catch (error) {
    console.error("Update Post Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const parsedPostId = parseInt(postId);

    if (isNaN(parsedPostId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: parsedPostId },
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete related records first
    await prisma.comment.deleteMany({ where: { postId: parsedPostId } });
    await prisma.likeDislike.deleteMany({ where: { postId: parsedPostId } });
    await prisma.repost.deleteMany({ where: { postId: parsedPostId } });
    await prisma.case.deleteMany({ where: { postId: parsedPostId } });

    // Now delete the post
    await prisma.post.delete({ where: { id: parsedPostId } });
    await removeUpload(existingPost.mediaUrl);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete Post Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


