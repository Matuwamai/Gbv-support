import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";

const prisma = new PrismaClient();

// ✅ MULTER CONFIGURATION FOR FILE UPLOADS
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure the 'uploads' folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage }).single("mediaUrl");

// ✅ CREATE A NEW POST (WITH MEDIA SUPPORT)
export const createPost = async (req, res) => {
  try {
    const { content, userId } = req.body;

    console.log("User ID:", userId);

    // Validate userId
    if (!userId || isNaN(parseInt(userId, 10))) {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }

    const numericUserId = parseInt(userId, 10);

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: numericUserId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Ensure media URL is correctly stored
    const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Create post
    const post = await prisma.post.create({
      data: { content, userId: numericUserId, mediaUrl: mediaUrl },
    });

    return res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error("Create Post Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// ✅ GET ALL POSTS (WITH IMAGES INCLUDED)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: { select: { id: true, name: true, } }, // Include profile photo
      },
      orderBy: { createdAt: "desc" },
    });

    // Ensure full media URL
    const updatedPosts = posts.map(post => ({
      ...post,
      mediaUrl: post.media ? `${process.env.BASE_URL}/uploads/${post.media}` : null, // Adjust path
    }));

    return res.status(200).json(updatedPosts);
  } catch (error) {
    console.error("Get Posts Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// ✅ GET A SINGLE POST (INCLUDES MEDIA URL)
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const id = parseInt(postId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true } } },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Add full media URL
    const updatedPost = {
      ...post,
      media: post.media ? `${process.env.BASE_URL}${post.media}` : null,
    };

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Get Post Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ UPDATE A POST (INCLUDES MEDIA URL)
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

    // Add full media URL
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

// ✅ DELETE A POST
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const existingPost = await prisma.post.findUnique({ where: { id: parseInt(postId) } });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete post
    await prisma.post.delete({ where: { id: parseInt(postId) } });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete Post Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
