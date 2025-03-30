import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createRepost = async (req, res) => {
  try {
    const { userId, postId } = req.body;
    
    if (!userId || !postId) {
      return res.status(400).json({ error: "Missing required fields: userId and postId" });
    }

    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }
    const postExists = await prisma.post.findUnique({ where: { id: postId } });
    if (!postExists) {
      return res.status(404).json({ error: "Post not found" });
    }
    const newRepost = await prisma.repost.create({
      data: { userId, postId },
    });

    return res.status(201).json({ message: "Repost created successfully", repost: newRepost });
  } catch (error) {
    console.error("Create Repost Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAllRepost = async (req, res) => {
  try {
    const reposts = await prisma.repost.findMany({
      include: {
        user: { 
          select: { 
            id: true, 
            name: true, 
            profileImage: true 
          },
        }, 
        post: {
          select: {
            id: true,
            userId: true,
            content: true,
            createdAt: true,
            mediaUrl: true, 
            user: { 
              select: { 
                id: true, 
                name: true, 
                profileImage: true 
              },
            }, 
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000'; 

    const repostsWithImagesAndMedia = reposts.map(repost => ({
      ...repost,
      user: {
        ...repost.user,
        profileImage: repost.user.profileImage ? `${baseUrl}${repost.user.profileImage}` : null,
      },
      post: {
        ...repost.post,
        user: {
          ...repost.post.user,
          profileImage: repost.post.user.profileImage ? `${baseUrl}${repost.post.user.profileImage}` : null,
        },
        mediaUrl: repost.post.mediaUrl ? `${baseUrl}${repost.post.mediaUrl}` : null, 
      },
    }));

    return res.status(200).json(repostsWithImagesAndMedia);
  } catch (error) {
    console.error("Get All Reposts Error:", error);
    return res.status(500).json({ error: "Error Fetching reposts" });
  }
};
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
export const deleteRepost = async (req, res) => {
  try {
    const { repostId } = req.params;
    if (!repostId || isNaN(repostId)) {
      return res.status(400).json({ error: "Invalid repost ID" });
    }

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
