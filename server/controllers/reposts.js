import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ✅ Create a new repost
export const createRepost = async (req, res) => {
  try {
    const { userId, postId } = req.body;
    
    if (!userId || !postId) {
      return res.status(400).json({ error: "Missing required fields: userId and postId" });
    }

    // Verify that the user exists
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify that the post exists
    const postExists = await prisma.post.findUnique({ where: { id: postId } });
    if (!postExists) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Create the repost
    const newRepost = await prisma.repost.create({
      data: { userId, postId },
    });

    return res.status(201).json({ message: "Repost created successfully", repost: newRepost });
  } catch (error) {
    console.error("Create Repost Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get all reposts for a specific post
export const getRepostsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId || isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }
    const reposts = await prisma.repost.findMany({
      where: { postId: parseInt(postId) },
      include: { 
        user: { select: { id: true, name: true } } 
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(reposts);
  } catch (error) {
    console.error("Get Reposts by Post Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get all reposts made by a specific user
export const getRepostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const reposts = await prisma.repost.findMany({
      where: { userId: parseInt(userId) },
      include: { 
        post: { 
          include: { 
            user: { select: { id: true, name: true } } 
          } 
        } 
      },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(reposts);
  } catch (error) {
    console.error("Get Reposts by User Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Delete a repost
export const deleteRepost = async (req, res) => {
  try {
    const { repostId } = req.params;
    if (!repostId || isNaN(repostId)) {
      return res.status(400).json({ error: "Invalid repost ID" });
    }
    // Verify repost exists
    const repostExists = await prisma.repost.findUnique({ where: { id: parseInt(repostId) } });
    if (!repostExists) {
      return res.status(404).json({ error: "Repost not found" });
    }

    await prisma.repost.delete({ where: { id: parseInt(repostId) } });
    return res.status(200).json({ message: "Repost deleted successfully" });
  } catch (error) {
    console.error("Delete Repost Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
