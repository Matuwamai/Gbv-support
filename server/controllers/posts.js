import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ CREATE A NEW POST
export const createPost = async (req, res) => {
  try {
    const { content, userId } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create post
    const post = await prisma.post.create({
      data: { content, userId },
    });

    return res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error("Create Post Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET ALL POSTS
export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Get Posts Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET A SINGLE POST BY ID
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
      include: { user: { select: { id: true, name: true } } },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error("Get Post Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ UPDATE A POST
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({ where: { id: parseInt(postId) } });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(postId) },
      data: { content },
    });

    return res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (error) {
    console.error("Update Post Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ DELETE A POST
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if post exists
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
