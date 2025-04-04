import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createRepost = async (req, res) => {
  try {
    const { postId, userId } = req.body;

    console.log("Reposting User ID:", userId);
    console.log("Original Post ID:", postId);

    if (!postId || isNaN(parseInt(postId, 10))) {
      return res.status(400).json({ message: "Invalid or missing postId" });
    }

    if (!userId || isNaN(parseInt(userId, 10))) {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }

    const numericPostId = parseInt(postId, 10);
    const numericUserId = parseInt(userId, 10);
    const post = await prisma.post.findUnique({
      where: { id: numericPostId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId === numericUserId) {
      return res.status(403).json({ message: "You cannot repost your own post" });
    }
    const repost = await prisma.repost.create({
      data: { postId: numericPostId, userId: numericUserId },
    });

    return res.status(201).json({ message: "Repost created successfully", repost });
  } catch (error) {
    console.error("Create Repost Error:", error);
    return res.status(500).json({ message: "Server error" });
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
  }}
      
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
