import prisma from "../lib/prisma.js";
import { withRepostMedia } from "../lib/media.js";
import { canModify } from "../lib/auth.js";

const userSelect = { select: { id: true, name: true, profileImage: true } };

const repostInclude = {
  user: userSelect,
  post: {
    select: {
      id: true,
      userId: true,
      content: true,
      createdAt: true,
      mediaUrl: true,
      user: userSelect,
    },
  },
};

const getRepostSummary = async (postId, userId) => {
  const [reposts, mine] = await Promise.all([
    prisma.repost.count({ where: { postId } }),
    prisma.repost.findFirst({ where: { postId, userId } }),
  ]);
  return { reposts, reposted: Boolean(mine) };
};

export const createRepost = async (req, res) => {
  try {
    const postId = parseInt(req.body.postId, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid or missing postId" });
    }

    const userId = req.user.id;
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.userId === userId) {
      return res.status(403).json({ message: "You cannot repost your own post" });
    }

    const existingRepost = await prisma.repost.findFirst({ where: { postId, userId } });
    if (existingRepost) {
      return res.status(409).json({ message: "You have already reposted this post" });
    }

    const repost = await prisma.repost.create({
      data: { postId, userId },
      include: repostInclude,
    });

    return res.status(201).json({
      message: "Repost created successfully",
      repost: withRepostMedia(repost),
      ...(await getRepostSummary(postId, userId)),
    });
  } catch (error) {
    console.error("Create Repost Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllRepost = async (req, res) => {
  try {
    const reposts = await prisma.repost.findMany({
      include: repostInclude,
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(reposts.map(withRepostMedia));
  } catch (error) {
    console.error("Get All Reposts Error:", error);
    return res.status(500).json({ error: "Error Fetching reposts" });
  }
};

export const getRepostsByUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const reposts = await prisma.repost.findMany({
      where: { userId },
      include: repostInclude,
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(reposts.map(withRepostMedia));
  } catch (error) {
    console.error("Get User Reposts Error:", error);
    return res.status(500).json({ error: "Error Fetching reposts" });
  }
};

export const getRepostsForPost = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }
    return res.status(200).json(await getRepostSummary(postId, req.user.id));
  } catch (error) {
    console.error("Get Post Reposts Error:", error);
    return res.status(500).json({ error: "Error Fetching reposts" });
  }
};

export const deleteRepost = async (req, res) => {
  try {
    const repostId = parseInt(req.params.repostId, 10);
    if (isNaN(repostId)) {
      return res.status(400).json({ error: "Invalid repost ID" });
    }

    const repost = await prisma.repost.findUnique({ where: { id: repostId } });
    if (!repost) {
      return res.status(404).json({ error: "Repost not found" });
    }
    if (!canModify(req.user, repost.userId)) {
      return res.status(403).json({ error: "You can only remove your own reposts" });
    }

    await prisma.repost.delete({ where: { id: repostId } });
    return res.status(200).json({ message: "Repost deleted successfully" });
  } catch (error) {
    console.error("Delete Repost Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
