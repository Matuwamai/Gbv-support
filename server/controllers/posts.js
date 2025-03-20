import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";

const prisma = new PrismaClient();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage }).single("mediaUrl");
export const createPost = async (req, res) => {
  try {
    const { content, userId } = req.body;

    console.log("User ID:", userId);
    if (!userId || isNaN(parseInt(userId, 10))) {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }

    const numericUserId = parseInt(userId, 10);

    const user = await prisma.user.findUnique({ where: { id: numericUserId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const post = await prisma.post.create({
      data: { content, userId: numericUserId, mediaUrl: mediaUrl },
    });

    return res.status(201).json({ message: "Post created successfully", post });
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
    const updatedPosts = posts.map(post => ({
      ...post,
      mediaUrl: post.mediaUrl ? `${process.env.BASE_URL}${post.mediaUrl}` : null,
      user: {
        ...post.user,
        profileImage: post.user.profileImage 
          ? `${process.env.BASE_URL}${post.user.profileImage}` 
          : null,
      },
    }));

    return res.status(200).json(updatedPosts);
  } catch (error) {
    console.error("Get Posts Error:", error);
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
    const updatedPost = {
      ...post,
      media: post.media ? `${process.env.BASE_URL}${post.media}` : null,
      user: {
        ...post.user,
        profileImage: post.user.profileImage 
          ? `${process.env.BASE_URL}${post.user.profileImage}` 
          : null,
      },
    };

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Get Post Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const existingPost = await prisma.post.findUnique({ where: { id: parseInt(postId, 10) } });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: parseInt(postId, 10) },
      data: { content },
    });
    const formattedPost = {
      ...updatedPost,
      media: updatedPost.media ? `${process.env.BASE_URL}${updatedPost.media}` : null,
    };

    return res.status(200).json({ message: "Post updated successfully", post: formattedPost });
  } catch (error) {
    console.error("Update Post Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const existingPost = await prisma.post.findUnique({ where: { id: parseInt(postId) } });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    await prisma.post.delete({ where: { id: parseInt(postId) } });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete Post Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
